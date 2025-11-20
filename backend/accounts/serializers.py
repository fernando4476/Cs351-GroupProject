#convert models into JSON
from rest_framework import serializers
from .models import CustomerProfile , ServiceProviderProfile
from django.db.models import Avg

class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    full_name = serializers.SerializerMethodField()

    
    class Meta:
        model = CustomerProfile
        fields = ['photo','id', 'username', 'first_name', 'last_name', 'full_name']
        read_only = ['full_name']

    #for setting full name
    def get_full_name(self, obj):
        first = obj.user.first_name or ""
        last = obj.user.last_name or ""
        return (first + " " + last).strip()
    
    #updating customer first and last name updates user object too
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        return super().update(instance, validated_data)


class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()

    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'user','photo', 'business_name', 'description', 'phone', 'rating']
        
        #automatically set user 
        read_only_fields = ['user', 'rating']  
    
    #calculate average rating
    def get_rating(self, obj):
        avg = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(avg or 0, 1)


        
