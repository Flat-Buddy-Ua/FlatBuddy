from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from user.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class VerifyMagicLinkView(APIView):
    permission_classes=[AllowAny]

    def get(self, request, token):
        user_id = cache.get(f"magic_token:{token}")

        if not user_id:
             return Response({'detail':'Invalid or expired link'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid or expired link'}, status=400)

        user.is_active = True
        user.save(update_fields=['is_active'])

        cache.delete(f"magic_token:{token}")

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=200)