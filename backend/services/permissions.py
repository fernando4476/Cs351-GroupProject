from rest_framework import permissions

class IsServiceProvider(permissions.BasePermission):
    # allow access only to authenticated users who have a ServiceProviderProfile.
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'serviceproviderprofile')