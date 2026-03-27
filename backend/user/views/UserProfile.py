from user.models import UserProfile
from user.serializers import UserProfileSerializer
from rest_framework import viewsets


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
