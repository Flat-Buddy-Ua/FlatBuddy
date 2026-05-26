from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from user.models import User
from user.matching.like_service import (
    handle_like, handle_unlike,
    get_incoming_likes, get_outgoing_likes, get_my_matches,
)
from user.serializers.LikeSerializer import (
    LikeActionSerializer, UserLikeSerializer, UserMatchSerializer,
)

class LikeCreateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeActionSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = User.objects.get(id=serializer.validated_data['to_user_id'])
        result = handle_like(request.user, to_user)
        return Response(result, status=status.HTTP_200_OK)


class LikeDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id: int):
        try:
            to_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Не знайдено.'}, status=status.HTTP_404_NOT_FOUND)
        result = handle_unlike(request.user, to_user)

        if result['status'] == 'not_found':
            return Response({'detail': 'Лайк не знайдено.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(result, status=status.HTTP_200_OK)


class IncomingLikesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        likes = get_incoming_likes(request.user)
        serializer = UserLikeSerializer(
            likes, many=True, context={'request': request}
        )
        return Response(serializer.data)


class OutgoingLikesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        likes = get_outgoing_likes(request.user)
        serializer = UserLikeSerializer(
            likes, many=True, context={'request': request}
        )
        return Response(serializer.data)


class MyMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = get_my_matches(request.user)
        serializer = UserMatchSerializer(
            matches, many=True, context={'request': request}
        )
        return Response(serializer.data)