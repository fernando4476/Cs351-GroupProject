from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomerProfile, ServiceProviderProfile


#ensures every user has customer profile at signup 
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer_profile(sender, instance, created, **kwargs):
    if created:
        CustomerProfile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_provider_profile(sender, instance, created, **kwargs):
    if created and getattr(instance, 'is_provider', False):
        ServiceProviderProfile.objects.create(user=instance)