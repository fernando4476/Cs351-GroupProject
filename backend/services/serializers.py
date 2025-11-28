#convert models into JSON
from rest_framework import serializers
from django.conf import settings
from .models import Service, Review, Booking
from accounts.serializers import ( CustomerProfileSerializer, 
                                  ServiceProviderProfileSerializer
                                  )



class ReviewSerializer(serializers.ModelSerializer):
    provider = ServiceProviderProfileSerializer(read_only=True)
    customer = CustomerProfileSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_at', 'provider', 'customer']
        read_only_fields = ['provider', 'customer', 'created_at']


class RatingSerializer(serializers.Serializer):
    average_rating = serializers.FloatField()

class ServiceSerializer(serializers.ModelSerializer):
    provider = ServiceProviderProfileSerializer(read_only=True)
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Service
        fields = ['id','photo','title', 'description', 'price','location', 'duration', 'provider', 'rating', 'review_count']

        read_only_fields = ['provider']




class RecentViewInSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()

## KASSANDRA - WHAT IS THIS FOR?
#----------------------------------------------------------------------
class ServiceCardSerializer(serializers.ModelSerializer):
    provider = ServiceProviderProfileSerializer(read_only=True)
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Service
        fields = ["id", "title", "description", "price", "location", "duration", "photo", "provider", "rating", "review_count"]

#----------------------------------------------------------------------



class BookingSerializer(serializers.ModelSerializer):
    customer = CustomerProfileSerializer(read_only=True)
    provider = ServiceProviderProfileSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'customer',
            'provider',
            'service',
            'date',
            'time',
            'note',
            'created_at'
        ]

        read_only_fields = [
            'customer',
            'provider',
            'created_at'
        ]


