#convert models into JSON
from rest_framework import serializers
from django.conf import settings
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'provider', 'title', 'description', 'price']

        
