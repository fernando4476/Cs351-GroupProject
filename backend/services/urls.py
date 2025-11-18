#defines service app endpoints and which views handle them

from django.urls import path
from .views import (
    ServiceListCreateView,
    AutocompleteAPIView,
    RecentViewRecord,
    RecentList,
    ServiceDetailView,
    ServiceReviewCreateView,
    ServiceBookingView,
)

urlpatterns = [
    #List all services or create a new one (GET, POST)
    path('services/', ServiceListCreateView.as_view(), name='service-list'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('services/<int:pk>/reviews/', ServiceReviewCreateView.as_view(), name='service-review'),
    path('services/<int:pk>/book/', ServiceBookingView.as_view(), name='service-book'),
    path('autocomplete/', AutocompleteAPIView.as_view(), name="autocomplete" ),
    path('recent/view/',   RecentViewRecord.as_view(),      name='recent-view'),
    path('recent/',        RecentList.as_view(),            name='recent-list'),
]
