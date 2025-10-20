#convert models into JSON

from rest_framework import serializers
from django.conf import settings
from .models import CustomerProfile , ServiceProviderProfile, Service



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
        field = ['id', 'provider', 'title', 'description', 'price']

        
#TEMP USER REGISTRATION
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
     
    class Meta:
        model = settings.AUTH_USER_MODEL
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # get current user model
        user_model = self.Meta.model

        #create new user
        user = user_model.objects.create_user(
            username=validated_data['username'],         # required field
            email=validated_data.get('email', ''),       # optional field
            password=validated_data['password']          # password is hashed automatically
        )
        
        # Return the new user object so DRF can respond with it
        return user