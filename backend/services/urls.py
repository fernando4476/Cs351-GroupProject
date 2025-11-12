#defines service app endpoints and which views handle them

from django.urls import path
from .views import (
    ServiceListCreateView,
    AutocompleteAPIView,
    RecentViewRecord,   
    RecentList,         
)

urlpatterns = [
    #List all services or create a new one (GET, POST)
    path('', ServiceListCreateView.as_view(), name='service-list'),
    path('autocomplete/', AutocompleteAPIView.as_view(), name="autocomplete" ),
    path('recent/view/',   RecentViewRecord.as_view(),      name='recent-view'),
    path('recent/',        RecentList.as_view(),            name='recent-list'),
]