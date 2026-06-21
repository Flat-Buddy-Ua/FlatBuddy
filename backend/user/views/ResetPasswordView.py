from rest_framework import generics
from rest_framework.permissions import AllowAny
from user.models import User
from user.serializers.ResetPasswordSerializer import ResetPasswordSerializer
from user.serializers.ResendLinkSerializer import ResendLinkSerializer
from rest_framework.response import Response
import secrets
from django.core.cache import cache
from user.constants.rate_limits import PASSWORD_RESET_TOKEN_TTL
from user.email_utils import send_reset_password_email

class RequestResetPasswordView(generics.GenericAPIView):
    serializer_class = ResendLinkSerializer
    permission_classes=[AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email, is_active=True)
            magic_token = secrets.token_urlsafe(32)
            cache.set(f"reset_password_token:{magic_token}", user.id, timeout=PASSWORD_RESET_TOKEN_TTL)
            send_reset_password_email(user=user, token=magic_token)
        except User.DoesNotExist:
            return Response({'detail':f'Link sent to email {email}'}, status=200)
        return Response({'detail':f'Link sent to email {email}'}, status=200)

class VerifyResetTokenView(generics.GenericAPIView):
    permission_classes=[AllowAny]
    def get(self, request, token):
        user_id = cache.get(f"reset_password_token:{token}")

        if not user_id:
             return Response({'detail':'Invalid or expired link'}, status=400)

        if not User.objects.filter(id=user_id).exists():
            return Response({'detail': 'Invalid or expired link'}, status=400)

        return Response({'detail': 'Token verified'}, status=200)

class ConfirmNewPasswordView(generics.GenericAPIView):
    permission_classes=[AllowAny]
    authentication_classes = []
    serializer_class = ResetPasswordSerializer

    def post(self, request, token):

        if not token:
            return Response({'detail': 'Token is required'}, status=400)
        
        user_id = cache.get(f"reset_password_token:{token}")
        if not user_id:
            return Response({'detail': 'Invalid or expired link'}, status=400)
            
        try:
            user = User.objects.get(id=user_id)

            serializer = self.get_serializer(user, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            cache.delete(f"reset_password_token:{token}")
            return Response({'detail': 'Password reset successfully'}, status=200)

        except User.DoesNotExist:
            return Response({'detail': 'Invalid or expired link'}, status=400)