#convert models into JSON
from rest_framework import serializers
from .models import Service, Review, Booking


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user", "rating", "comment", "created_at"]


class ServiceSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "title",
            "description",
            "price",
            "provider_name",
            "business_name",
            "location",
            "image",
            "rating",
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(source="review", many=True, read_only=True)
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "title",
            "description",
            "price",
            "provider_name",
            "business_name",
            "location",
            "image",
            "rating",
            "reviews",
        ]


class RecentViewInSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()


class ServiceCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id",
            "title",
            "description",
            "price",
            "provider_name",
            "business_name",
            "location",
            "image",
            "rating",
        ]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "slot_date", "slot_time", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class BookingCreateSerializer(serializers.Serializer):
    slot_date = serializers.DateField()
    slot_time = serializers.CharField(max_length=50)
    notes = serializers.CharField(required=False, allow_blank=True)
