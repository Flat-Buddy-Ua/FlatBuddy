import rest_framework

from user.models import UserHousing
from user.serializers import UserHousingSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class UserHousingViewSet(viewsets.ModelViewSet):
    queryset = UserHousing.objects.all()
    serializer_class = UserHousingSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        housing, created = UserHousing.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            serializer = self.get_serializer(housing)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            serializer = self.get_serializer(housing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
    
    
