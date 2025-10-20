#defines service app endpoints and which views handle them

from django.urls import path
from .views import CustomerProfileListView, ServiceProviderProfileListView

urlpatterns = [
    path('customers/', CustomerProfileListView.as_view(), name='customer-list'),
    path('providers/', ServiceProviderProfileListView.as_view(), name='provider-list')
]