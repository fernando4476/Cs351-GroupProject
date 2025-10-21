#routes URLs to views
#decides which app should handle request

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('services.urls')),
    path("auth/", include("accounts.urls")),
]
