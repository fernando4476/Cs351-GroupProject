from django.db import models
from django.conf import settings


class Service(models.Model):
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.TextField(blank=True)
    image = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} by {self.provider.username}"

    @property
    def provider_name(self):
        return self.provider.username

    @property
    def business_name(self):
        return self.provider.serviceproviderprofile.business_name

    @property
    def provider_phone(self):
        profile = getattr(self.provider, "serviceproviderprofile", None)
        return profile.phone if profile and profile.phone else ""


class RecentServiceView(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recent_service_views",
    )
    service = models.ForeignKey("Service", on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "-viewed_at"]),
        ]
        ordering = ["-viewed_at"]

    def __str__(self):
        return f"{self.user_id} viewed {self.service_id} at {self.viewed_at}"


class Review(models.Model):
    service = models.ForeignKey(
        Service, related_name="review", on_delete=models.CASCADE
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Booking(models.Model):
    service = models.ForeignKey(
        Service, related_name="bookings", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="service_bookings",
    )
    slot_date = models.DateField()
    slot_time = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service_id} on {self.slot_date} at {self.slot_time}"
