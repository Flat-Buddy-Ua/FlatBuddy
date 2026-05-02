from user.serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from user.email_utils import send_magic_link
from django.core.cache import cache
import secrets
from user.constants.rate_limits import MAGIC_LINK_TOKEN_TTL, MAGIC_LINK_ATTEMPTS_TTL

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        rate_key = f"magic_link_rate:{user.id}"
        cache.set(rate_key, 1, timeout=MAGIC_LINK_ATTEMPTS_TTL)

        magic_token = secrets.token_urlsafe(32)
        cache.set(f"magic_token:{magic_token}", user.id, timeout=MAGIC_LINK_TOKEN_TTL)

        send_magic_link(user=user, token=magic_token)
        
        return Response({
            'detail': f'Link sent to email {user.email}'
        }, status=201)