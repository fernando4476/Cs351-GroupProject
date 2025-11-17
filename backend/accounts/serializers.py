#convert models into JSON
from rest_framework import serializers
from .models import CustomerProfile , ServiceProviderProfile


class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    class Meta:
        model = CustomerProfile
        fields = ['photo''id', 'username', 'first_name']

class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'business_name', 'description', 'phone']
