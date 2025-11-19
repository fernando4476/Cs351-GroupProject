#defines service app endpoints and which views handle them

from django.urls import path
from .views import (
    ServiceListCreateView,
    AutocompleteAPIView,
    RecentViewRecord,   
    RecentList,   
    ServiceDetailView,
    UserAppointmentsView,
    ProviderAppointmentsView,     
    CreateReviewView
)

urlpatterns = [
    #List all services or create a new one (GET, POST)
    path('services/', ServiceListCreateView.as_view(), name='service-list'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('autocomplete/', AutocompleteAPIView.as_view(), name="autocomplete" ),
    path('recent/view/',   RecentViewRecord.as_view(),      name='recent-view'),
    path('recent/',        RecentList.as_view(),            name='recent-list'),
    # Appointments
    path('appointments/user/',     UserAppointmentsView.as_view(),     name='user-appointments'),
    path('appointments/provider/', ProviderAppointmentsView.as_view(), name='provider-appointments'),
    path('providers/<int:provider_id>/reviews/', CreateReviewView.as_view())
]