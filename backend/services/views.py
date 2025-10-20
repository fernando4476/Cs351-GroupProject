#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from django.shortcuts import render
from rest_framework import generics
from .models import CustomerProfile, ServiceProviderProfile, Service
from .serializers import CustomerProfileSerializer, ServiceProviderProfileSerializer, ServiceSerializer, UserRegistrationSerializer
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
    serilaizer_class = UserRegistrationSerializer