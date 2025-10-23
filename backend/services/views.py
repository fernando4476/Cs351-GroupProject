# services/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import CustomerProfile, ServiceProviderProfile, Service
from .serializers import (
    CustomerProfileSerializer,
    ServiceProviderProfileSerializer,
    ServiceSerializer,
    UserRegistrationSerializer,
)
from .trie import Trie

class CustomerProfileListView(generics.ListCreateAPIView):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer

class ServiceProviderProfileListView(generics.ListCreateAPIView):
    queryset = ServiceProviderProfile.objects.all()
    serializer_class = ServiceProviderProfileSerializer

class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer  # <-- fixed typo

# Build trie lazily the first time endpoint is hit
_trie = None
def _get_trie():
    global _trie
    if _trie is None:
        t = Trie()
        for svc in Service.objects.all():
            t.insert(svc.title)   # <-- fixed field name
        _trie = t
    return _trie

class AutocompleteAPIView(APIView):
    def get(self, request):
        prefix = request.GET.get('prefix', '')   # <-- fixed GET
        if not prefix:
            return Response({'results': []})
        trie = _get_trie()
        results = trie.starts_with(prefix)[:10]
        return Response({'results': results})
