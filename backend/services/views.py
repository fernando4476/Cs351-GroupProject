#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from .models import Service, RecentServiceView, Booking, Review
from .serializers import (
    ServiceSerializer, 
    RecentViewInSerializer, 
    ServiceCardSerializer,
    ReviewSerializer,
    BookingSerializer,
    RatingSerializer) 
from .trie import Trie
from .recent import push_view, get_recent_list
from .permissions import IsServiceProvider
from rest_framework import filters
from accounts.models import ServiceProviderProfile , CustomerProfile
from .recommendations import build_similarity_graph, iddfs


#get returns list of services, post creates a service 
class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer 
    permission_classes = [IsServiceProvider]

    def get_permissions(self):
        if self.request.method in ["GET", "HEAD", "OPTIONS"]:
            return [permissions.AllowAny()]
        return super().get_permissions()

    # adds filtering
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'provider__first_name']

    #if get request
    def get_queryset(self):
        return Service.objects.all().annotate(
            rating=Avg('review__rating'),
            review_count=Count('review', distinct=True),
        )
    def perform_create(self, serializer):
        provider = self.request.user.serviceproviderprofile 
        serializer.save(provider=provider)
    

    
#returns the service info; allow provider to update/delete their own service
class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Service.objects.all().annotate(
            rating=Avg('review__rating'),
            review_count=Count('review', distinct=True),
        )
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            if not hasattr(self.request.user, "serviceproviderprofile"):
                return Service.objects.none()
            return qs.filter(provider=self.request.user.serviceproviderprofile)
        return qs

    def perform_update(self, serializer):
        serializer.save(provider=self.request.user.serviceproviderprofile)
    
   
    
# returns list matching prefix 
class AutocompleteAPIView(APIView):
    def get(self, request):
        prefix = request.GET.get('prefix', '')   # <-- fixed GET
        if not prefix:
            return Response({'results': []})
        
        # build trie
        trie = Trie()
        for service in Service.objects.all():
                trie.insert(service.title)
        results = trie.starts_with(prefix)[:10] 
        return Response({'results': results}) 
    
class RecentViewRecord(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        s = RecentViewInSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        service_id = s.validated_data["service_id"]
        svc = get_object_or_404(Service, id=service_id)

        # persist
        RecentServiceView.objects.create(
            user=request.user, service=svc, viewed_at=timezone.now()
        )
        # update skip list
        push_view(request.user, svc)
        return Response({"ok": True})

class RecentList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ids = get_recent_list(request.user, limit=20)
        # fetch in the same order as skip list:
        svc_map = {s.id: s for s in Service.objects.filter(id__in=ids)}
        ordered = [svc_map[i] for i in ids if i in svc_map]
        data = ServiceCardSerializer(ordered, many=True).data
        return Response({"results": data})
    

#post reviews
class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        provider_id = self.kwargs["provider_id"]
        provider = ServiceProviderProfile.objects.get(id=provider_id)
        service_id = self.request.data.get("service")
        service = Service.objects.filter(id=service_id).first() if service_id else None

        serializer.save(
            customer= self.request.user.customer,
            provider=provider,
            service=service
        )

    
#get provider's reviews
class ProviderReviewsListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        provider_id = self.kwargs["provider_id"]
        return Review.objects.filter(provider_id=provider_id)

# get current customer's reviews
class MyReviewsListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(customer__user=self.request.user).order_by("-created_at")

# update/delete a review owned by the current user
class MyReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(customer__user=self.request.user)

#get providers average rating
class ProviderRatingView(generics.GenericAPIView):
    serializer_class = RatingSerializer

    def get(self, request, provider_id):
        avg_rating = Review.objects.filter(provider_id=provider_id) \
                                   .aggregate(avg=Avg("rating"))["avg"] or None
        return Response({"average_rating": avg_rating})

#book an appointment
class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        #get ids from url
        provider_id = self.kwargs["provider_id"]
        service_id = self.kwargs["service_id"]

        #get profiles and service using ids
        provider = ServiceProviderProfile.objects.get(id=provider_id)
        service = Service.objects.get(id=service_id)
        customer = CustomerProfile.objects.get(user=self.request.user)

        #save to db
        serializer.save(
            customer=customer,
            provider=provider,
            service=service
        )

#get bookings for provider
class ProviderBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        provider_id = self.kwargs["provider_id"]
        return Booking.objects.filter(provider_id=provider_id)


class MyBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        customer = CustomerProfile.objects.get(user=self.request.user)
        return Booking.objects.filter(customer=customer)


class ServiceRecommendationsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, service_id):
        services_qs = (
            Service.objects.all()
            .select_related("provider", "provider__user")
            .annotate(
                rating=Avg("review__rating"),
                review_count=Count("review", distinct=True),
            )
        )
        services = list(services_qs)
        service_map = {svc.id: svc for svc in services}
        if service_id not in service_map:
            return Response(
                {"detail": "Service not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        graph = build_similarity_graph(services)
        layers = iddfs(graph, service_id, max_depth=3)

        def serialize_layer(depth):
            ids = layers.get(depth, [])
            ordered = [service_map[sid] for sid in ids if sid in service_map]
            serializer = ServiceCardSerializer(
                ordered, many=True, context={"request": request}
            )
            return serializer.data

        payload = {
            "depth_1": serialize_layer(1),
            "depth_2": serialize_layer(2),
            "depth_3": serialize_layer(3),
        }
        return Response(payload)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        customer = CustomerProfile.objects.get(user=self.request.user)
        return Booking.objects.filter(customer=customer)

    def perform_update(self, serializer):
        customer = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer)
