from user.models import UserProfile
from user.serializers import UserProfileSerializer
from rest_framework import generics, viewsets

from rest_framework.permissions import IsAuthenticated, IsAdminUser


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]
    
class MeProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile