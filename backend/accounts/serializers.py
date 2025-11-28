#convert models into JSON
from rest_framework import serializers
from .models import CustomerProfile , ServiceProviderProfile, Feedback
from django.db.models import Avg

class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    country = serializers.CharField(required=False, allow_blank=True)
    full_name = serializers.SerializerMethodField()

    
    class Meta:
        model = CustomerProfile
        fields = ['photo','id', 'username', 'first_name', 'last_name', 'email', 'country', 'full_name']
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
        # keep username in sync with email when email changes
        if 'email' in user_data:
            instance.user.username = user_data.get('email', instance.user.username)
        if 'country' in validated_data:
            instance.country = validated_data.get('country', instance.country)
        instance.user.save()
        return super().update(instance, validated_data)


class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'user','photo', 'business_name', 'description', 'phone', 'rating', 'review_count']
        
        #automatically set user 
        read_only_fields = ['user', 'rating']  
    
    #calculate average rating
    def get_rating(self, obj):
        avg = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(avg or 0, 1)

    def get_review_count(self, obj):
        return obj.reviews.count()


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "full_name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


        
