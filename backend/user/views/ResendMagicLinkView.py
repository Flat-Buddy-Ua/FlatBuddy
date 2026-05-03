from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.cache import cache
from user.models import User
from user.serializers.ResendLinkSerializer import ResendLinkSerializer
from user.constants.rate_limits import (MAGIC_LINK_ATTEMPTS_TTL, MAGIC_LINK_BACKOFF_TIMEOUTS,MAGIC_LINK_FREE_ATTEMPTS,MAGIC_LINK_TOKEN_TTL, MAGIC_LINK_MAX_BLOCK_TIMEOUT, MAX_ATTEMPTS)
from user.email_utils import send_magic_link
import secrets
import math


class ResendMagicLinkView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResendLinkSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email, is_active=False)
        except User.DoesNotExist:
            return Response({'detail':'User not found or already verified'}, status=400)

        rate_key = f"magic_link_rate:{user.id}"
        block_key = f"magic_link_block:{user.id}"

        block_time = cache.ttl(block_key)
        if block_time and block_time > 0:
            return Response({'detail':f'Try again in {math.ceil(block_time / 60)} minutes'}, status=429)

        if cache.get(rate_key) is None:
            attempts = 1
            cache.set(rate_key, attempts, timeout=MAGIC_LINK_ATTEMPTS_TTL)
        else:
            attempts = cache.incr(rate_key)

        if attempts > MAX_ATTEMPTS:
            cache.set(block_key, True, timeout=MAGIC_LINK_MAX_BLOCK_TIMEOUT)
            cache.delete(rate_key)
            return Response({'detail':'Try again in 24 hours'}, status=429)

        if attempts in MAGIC_LINK_BACKOFF_TIMEOUTS:
            timeout = MAGIC_LINK_BACKOFF_TIMEOUTS[attempts]
            cache.set(block_key, True, timeout=timeout)
            return Response({'detail':f'Try again in {math.ceil(timeout / 60)}'}, status=429)

        magic_token = secrets.token_urlsafe(32)
        cache.set(f"magic_token:{magic_token}", user.id, timeout=MAGIC_LINK_TOKEN_TTL)
        send_magic_link(user=user, token=magic_token)

        return Response({'detail':f'Link sent to email {user.email}'}, status=200)