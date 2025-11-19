from django.db import models
from django.conf import settings



class Service(models.Model):
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(default=2)
    location = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} by {self.provider.username}"
    
    @property
    def provider_name(self):
        return self.provider.username

    @property
    def business_name(self):
        return self.provider.serviceproviderprofile.business_name
    
class RecentServiceView(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recent_service_views")
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
    service = models.ForeignKey(Service, related_name="review", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # e.g., 1–5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Appointment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments"
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="appointments"
    )
    appointment_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )

    def __str__(self):
        return f"{self.user.username} → {self.service.title} at {self.appointment_time}"
