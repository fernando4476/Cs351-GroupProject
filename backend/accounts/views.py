# accounts/views.py
# Signup + email verification. Requires @uic.edu emails.

import re, json
from django.views import View
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate 
from .models import CustomerProfile, ServiceProviderProfile
from .serializers import CustomerProfileSerializer, ServiceProviderProfileSerializer
from rest_framework import generics
from rest_framework import generics, permissions
from rest_framework import filters


User = get_user_model()

# Only allow UIC emails (case-insensitive)
UIC_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@uic\.edu$", re.IGNORECASE)

@method_decorator(csrf_exempt, name="dispatch")  # simplify dev: allow JSON POST from React
class SignupView(View):
    """
    POST /auth/signup
    JSON body: {"name":"...","email":"...","password":"..."}
    Creates an inactive user, sends verification email.
    """
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not (name and email and password):
            return JsonResponse({"error": "Missing name/email/password"}, status=400)

        # Enforce UIC-only
        if not UIC_REGEX.match(email):
            return JsonResponse({"error": "Email must be a @uic.edu address"}, status=400)

        # Prevent duplicate registration
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=409)

        # Create inactive user; use email as username if default User model
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_active=False,  # key: locked until they verify via email
        )
        if hasattr(user, "first_name"):
            user.first_name = name
            user.save(update_fields=["first_name"])

        # Build verification link containing uid + token
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verify_path = reverse("verify-email", args=[uidb64, token])

        verify_url = request.build_absolute_uri(verify_path)

        # Send the email (prints to terminal in dev)
        subject = "Verify your UIC Marketplace account"
        message = (
            f"Hi {name},\n\n"
            f"Click the link to verify your account:\n{verify_url}\n\n"
            f"If you didn't sign up, you can ignore this email."
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)

        return JsonResponse({"ok": True, "message": "Verification email sent"})

class VerifyEmailView(View):
    """
    GET /auth/verify/<uidb64>/<token>/
    If token is valid, activates user then redirects to frontend with status flag.
    """
    def get(self, request, uidb64, token):
        user = None
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            pass

        success = False
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            success = True

        dest = getattr(settings, "FRONTEND_ORIGIN", "http://localhost:5173").rstrip("/")
        return HttpResponseRedirect(f"{dest}/verify?status={'success' if success else 'failed'}")



class LoginView(View):
    """
    POST /auth/login
    JSON: {"email":"...", "password":"..."}
    Returns {ok:true, name: "..."} only if credentials are correct AND user.is_active == True
    (No session/cookies yet – milestone-friendly. Add sessions later.)
    """
    @method_decorator(csrf_exempt)  # dev convenience
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        if not (email and password):
            return JsonResponse({"error": "Missing email/password"}, status=400)

        user = authenticate(username=email, password=password)
        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        if not user.is_active:
            return JsonResponse({"error": "Please verify your email first"}, status=403)

        # success – milestone version just returns JSON
        name = ""
        if hasattr(user, "first_name"):
            name = user.first_name or ""
        return JsonResponse({"ok": True, "name": name or email.split("@")[0]})


class CustomerProfileListView(generics.ListAPIView):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer

class ServiceProviderProfileListView(generics.ListAPIView):
    queryset = ServiceProviderProfile.objects.all()
    serializer_class = ServiceProviderProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['business_name', 'description', 'user__first_name']