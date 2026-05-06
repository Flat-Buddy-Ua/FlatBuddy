from user.models import User
from user.serializers import UserSerializer
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    
class MeUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user