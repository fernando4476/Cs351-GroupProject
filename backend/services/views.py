#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from django.shortcuts import render
from rest_framework import generics
from .models import CustomerProfile, ServiceProviderProfile
from .serializers import CustomerProfileSerializer, ServiceProviderProfileSerializer

class CustomerProfileListView(generics.ListCreateAPIView):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer

class ServiceProviderProfileListView(generics.ListCreateAPIView):
    queryset = ServiceProviderProfile.objects.all()
    serializer_class = ServiceProviderProfileSerializer

    