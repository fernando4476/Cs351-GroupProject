#convert models into JSON

from rest_framework import serializers
from django.conf import settings
from .models import CustomerProfile , ServiceProviderProfile, Service
from django.contrib.auth import get_user_model


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields =['id','user']

class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'user', 'business_name', 'description', 'phone']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'provider', 'title', 'description', 'price']

# TEMP USER REGISTRATION 
User = get_user_model()
        
#TEMP USER REGISTRATION
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
     
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )