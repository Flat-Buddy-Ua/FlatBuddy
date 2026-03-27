from user.serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
