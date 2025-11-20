from django.urls import path
from .views import ( SignupView, 
                     VerifyEmailView, 
                     LoginView, UpdateProfileView, 
                     UserAccountDetailsView )
from .views import ( CustomerProfileListView,
                     ServiceProviderProfileListView,
                     ServiceProviderProfileCreateView )
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    # list all customers 
    path('customers/', CustomerProfileListView.as_view(), name='customer-list'),
    # list all providers
    path('providers/', ServiceProviderProfileListView.as_view(), name='provider-list'),
    # obtain token
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # refresh token 
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    #create provider profile
    path("service-provider/", ServiceProviderProfileCreateView.as_view(), name="create-provider"),
    #update user profile
    path('profile/update/', UpdateProfileView.as_view()),
    #get user account details
    path('profile/me/', UserAccountDetailsView.as_view())
]
