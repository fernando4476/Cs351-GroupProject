from django.urls import path
from .views import SignupView, VerifyEmailView, LoginView

urlpatterns = [
    path("signup", SignupView.as_view(), name="signup"),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("login", LoginView.as_view(), name="login"),
]
