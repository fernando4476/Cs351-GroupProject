#defines service app endpoints and which views handle them

from django.urls import path
from .views import (
    ServiceListCreateView,
    AutocompleteAPIView,
    RecentViewRecord,   
    RecentList,   
    ServiceDetailView,    
    CreateReviewView,
    ProviderReviewsListView,
    CreateBookingView,
    ProviderBookingsListView,
    MyBookingsListView,
    ProviderRatingView,
    BookingDetailView,
    MyReviewsListView,
    MyReviewDetailView,
    ServiceRecommendationsView,
)

urlpatterns = [
    #List all services or create a new one (GET, POST)
    path('services/', ServiceListCreateView.as_view(), name='service-list'),
    #Get details for single servive
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('services/<int:service_id>/recommendations/', ServiceRecommendationsView.as_view(), name='service-recommendations'),
    #trie implementation, get list of words with matching prefix 
    path('autocomplete/', AutocompleteAPIView.as_view(), name="autocomplete" ),
    #skip-list, post user selected service
    path('recent/view/',   RecentViewRecord.as_view(),      name='recent-view'),
    #skip-list, returns list of users recently accessed services
    path('recent/',        RecentList.as_view(),            name='recent-list'),
    # Appointments
    # path('appointments/user/',     UserAppointmentsView.as_view(),     name='user-appointments'),
    # path('appointments/provider/', ProviderAppointmentsView.as_view(), name='provider-appointments'),
    # post a review for a provider 
    path('providers/<int:provider_id>/reviews/create/', CreateReviewView.as_view()),
    #get list of reviews left for provider 
    path('providers/<int:provider_id>/reviews/', ProviderReviewsListView.as_view()),
    path('reviews/my/', MyReviewsListView.as_view()),
    path('reviews/my/<int:pk>/', MyReviewDetailView.as_view()),
    #book an appointment 
    path('providers/<provider_id>/services/<service_id>/bookings/', CreateBookingView.as_view()),
    #get provider's rating
    path('providers/<provider_id>/rating/', ProviderRatingView.as_view()),
    #get provider's bookings 
    path('providers/<provider_id>/bookings/', ProviderBookingsListView.as_view()),
    #get customer's booking
    path('bookings/my/', MyBookingsListView.as_view()),
    # booking detail (customer)
    path('bookings/<int:pk>/', BookingDetailView.as_view()),
]
