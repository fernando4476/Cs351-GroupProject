#convert models into JSON

from rest_framework import serializers
from .models import CustomerProfile , ServiceProviderProfile



class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields =['id','user']

class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'user', 'business_name', 'description', 'phone']