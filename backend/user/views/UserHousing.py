from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from user.models import UserHousing
from user.serializers.UserHousingSerializer import UserHousingSerializer
from .BaseView import BaseViewSet
from user.constants.choices import DISTRICTS_BY_CITY, CITY_CHOICES


class UserHousingViewSet(BaseViewSet):
    queryset = UserHousing.objects.all()
    serializer_class = UserHousingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserHousing.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        super().perform_create(serializer)
    
    def _get_city_id_from_name(self, city_name):
        if not city_name:
            return None
        
        city_name_str = str(city_name).strip()
        city_name_lower = city_name_str.lower()
        
        for city_id, name in CITY_CHOICES.items():
            if name.lower() == city_name_lower:
                return city_id
        
        for city_id, name in CITY_CHOICES.items():
            if city_name_lower in name.lower() or name.lower() in city_name_lower:
                return city_id
        
        city_name_no_apostrophe = city_name_lower.replace("'", "")
        for city_id, name in CITY_CHOICES.items():
            if name.lower().replace("'", "") == city_name_no_apostrophe:
                return city_id
        
        return None
    
    @action(detail=False, methods=['get'])
    def districts(self, request):
        city_name = request.user.city
        city_id = self._get_city_id_from_name(city_name)
        
        if not city_id:
            return Response({
                "detail": f"Місто '{city_name}' не знайдено в системі. Оберіть місто зі списку.",
                "districts": [],
                "count": 0
            }, status=status.HTTP_400_BAD_REQUEST)
        
        city_districts = DISTRICTS_BY_CITY.get(city_id, {})
        
        districts_list = [
            {"id": id, "name": name} 
            for id, name in city_districts.items()
        ]
        
        return Response({
            "city_id": city_id,
            "city_name": CITY_CHOICES.get(city_id, city_name),
            "districts": districts_list,
            "count": len(districts_list)
        })
    
    @action(detail=False, methods=['get', 'post', 'put'])
    def my(self, request):
        try:
            housing = UserHousing.objects.get(user=request.user)
            
            if request.method == 'GET':
                serializer = self.get_serializer(housing)
                return Response(serializer.data)
                
            elif request.method in ['POST', 'PUT']:
                serializer = self.get_serializer(housing, data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                return Response({
                    "message": "Житлові уподобання успішно оновлено",
                    "data": serializer.data
                })
                
        except UserHousing.DoesNotExist:
            if request.method == 'GET':
                return Response(
                    {"detail": "Житлові уподобання не знайдено"},
                    status=status.HTTP_404_NOT_FOUND
                )
            elif request.method in ['POST', 'PUT']:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                return Response({
                    "message": "Житлові уподобання успішно створено",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)