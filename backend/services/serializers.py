#convert models into JSON
from rest_framework import serializers
from django.conf import settings
from .models import Service, Review



class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']


class ServiceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    rating = serializers.FloatField(read_only=True)  

    class Meta:
        model = Service
        fields = ['id', 'provider','provider_name', 'title', 'description', 'price','location', 'rating']

class ServiceDetailSerializer(serializers.ModelSerializer):
    # TODO: add service photo?
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    reviews = ReviewSerializer(source="review", many=True, read_only=True) 
    rating = serializers.FloatField(read_only=True)  
    
    class Meta:
        model = Service
        fields = ['id', 'provider','provider_name', 'title', 'description', 'price', 'location', 'rating', 'reviews'] 
        
class RecentViewInSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()

class ServiceCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "title", "description", "price", "provider"]


    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']