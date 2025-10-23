#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomerProfile, ServiceProviderProfile, Service
from .serializers import CustomerProfileSerializer, ServiceProviderProfileSerializer, ServiceSerializer, UserRegistrationSerializer

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
    serilaizer_class = UserRegistrationSerializer



class AutocompleteAPIView(APIView):
    def get(self, request):
        prefix = request.Get.get('prefix', '')

        if not prefix: 
            return Response({'result': []})
        
        #use trie to get suggestions
        results = trie.starts_with(prefix)[:10]
        return Response({'results': results})
    

#build trie
trie = Trie()
for service in Service.objects.all():
    trie.insert(service.name)
    


