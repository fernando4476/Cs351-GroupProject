from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

#creating two profile models
class CustomerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    #add preferred service type list o build recommendation

    def __str__(self):
        return f"Customer Profile for {self.user.username}"
    

#ensures every user has customer profile at signup 
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer_profile(send, instance, created, **kwargs):
    if created:
        CustomerProfile.objects.create(user=instance)


class ServiceProviderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Provider Profile for {self.business_name} ({self.user.username})"
