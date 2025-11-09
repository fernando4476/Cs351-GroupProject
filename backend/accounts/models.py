from django.db import models
from django.conf import settings


#user profiles, CustomerProfile is autocreated when User is created 

class CustomerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    #add preferred service type list to build recommendation

    def __str__(self):
        return f"Customer Profile for {self.user.username}"
    

class ServiceProviderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Provider Profile for {self.business_name} ({self.user.username})"
