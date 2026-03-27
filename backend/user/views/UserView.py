from user.models import User
from user.serializers import UserSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
