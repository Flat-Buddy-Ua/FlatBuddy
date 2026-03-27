from user.models import UserHousing
from user.serializers import UserHousingSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class UserHousingViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = UserHousing.objects.all()
    serializer_class = UserHousingSerializer
