#defines service app endpoints and which views handle them

from django.urls import path
from .views import CustomerProfileListView, ServiceProviderProfileListView

urlpatterns = [
    #List all customers or create a new one (GET, POST)
    path('customers/', CustomerProfileListView.as_view(), name='customer-list'),
    #List all providers or create a new one (GET, POST)
    path('providers/', ServiceProviderProfileListView.as_view(), name='provider-list')
]