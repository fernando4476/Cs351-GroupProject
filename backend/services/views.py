#define how to respond to http requests
#DRF used to create API views that frontend interacts with 
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Service
from .serializers import ServiceSerializer
from .trie import Trie


class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer 

    
class AutocompleteAPIView(APIView):
    def get(self, request):
        prefix = request.Get.get('prefix', '')

        if not prefix: 
            return Response({'result': []})
        
        #use trie to get suggestions
        results = trie.starts_with(prefix)[:10]
        return Response({'results': results}) 

# build trie
trie = Trie()
for service in Service.objects.all():
    trie.insert(service.title)
    


