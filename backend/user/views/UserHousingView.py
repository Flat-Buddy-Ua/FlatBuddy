from user.models import UserHousing
from user.serializers import UserHousingSerializer
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class UserHousingViewSet(viewsets.ModelViewSet):
    queryset = UserHousing.objects.all()
    serializer_class = UserHousingSerializer
    permission_classes = [IsAdminUser]

class MeHousingView(generics.RetrieveUpdateAPIView):
    serializer_class = UserHousingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.housing
    
    
