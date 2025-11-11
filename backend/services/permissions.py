from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS

# allow access only to authenticated users who have a ServiceProviderProfile.
class IsServiceProvider(permissions.BasePermission):
    
    def has_permission(self, request, view):
        # changes authorization needed based on Post or Get
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user.is_authenticated and hasattr(request.user, 'serviceproviderprofile')