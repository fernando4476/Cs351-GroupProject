from django.db import models
from django.conf import settings
from accounts.models import ServiceProviderProfile, CustomerProfile



class Service(models.Model):
    provider = models.ForeignKey(ServiceProviderProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(default=2)
    location = models.TextField(blank=True)
    
    photo = models.ImageField(
        upload_to='photos/',
        default= 'photos/default-service.jpeg'
    )

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
    #user leaving review
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, null=True)
    #the provider the review is for
    provider = models.ForeignKey(ServiceProviderProfile, on_delete=models.CASCADE, related_name='reviews',null=True)
    #the service the review is for 
    service = models.ForeignKey(Service, on_delete=models.CASCADE, null=True)
    rating = models.PositiveSmallIntegerField(null=True) 
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Booking(models.Model):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    provider = models.ForeignKey(ServiceProviderProfile, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.user.username} → {self.provider.user.username} ({self.service.name})"


