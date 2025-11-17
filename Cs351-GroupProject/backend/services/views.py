#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from .models import Service, RecentServiceView
from .serializers import ServiceSerializer, ServiceDetailSerializer, RecentViewInSerializer, ServiceCardSerializer
from .trie import Trie
from .recent import push_view, get_recent_list
from .permissions import IsServiceProvider
from rest_framework import filters



#get returns list of services, post creates a service 
class ServiceListCreateView(generics.ListCreateAPIView):
 
    serializer_class = ServiceSerializer 
    permission_classes = [IsServiceProvider]

    # adds filtering
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'provider__first_name']

    #if get request
    def get_queryset(self):
        return Service.objects.all().annotate(
            rating=Avg('review__rating')
        )
    def perform_create(self, serializer):
        # Automatically assign the provider and initialize rating to 0
        serializer.save(provider=self.request.user)
    

    
#returns the service info 
class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.annotate(rating=Avg("review__rating"))
    serializer_class = ServiceDetailSerializer
   
    


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
        push_view(request.user, service_id)
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
    



