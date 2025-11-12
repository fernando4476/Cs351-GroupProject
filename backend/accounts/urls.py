from django.urls import path
from .views import SignupView, VerifyEmailView, LoginView
from .views import CustomerProfileListView, ServiceProviderProfileListView


urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    #List all customers 
    path('customers/', CustomerProfileListView.as_view(), name='customer-list'),
    #List all providers
    path('providers/', ServiceProviderProfileListView.as_view(), name='provider-list')
]
