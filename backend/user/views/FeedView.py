from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from user.models import SeenProfile
from user.matching.feed_service import get_fomo_data


class MarkSeenView(APIView):
    """
    POST /api/matches/<int:match_id>/seen/
    Фіксує що юзер переглянув профіль.
    Фронтенд викликає після показу кожної картки.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        from user.models import MatchResult

        try:
            match = MatchResult.objects.get(id=match_id)
        except MatchResult.DoesNotExist:
            return Response({"detail": "Матч не знайдено."}, status=status.HTTP_404_NOT_FOUND)

        # Перевіряємо що матч належить цьому юзеру
        user = request.user
        if match.user_1 != user and match.user_2 != user:
            return Response({"detail": "Немає доступу."}, status=status.HTTP_403_FORBIDDEN)

        SeenProfile.objects.get_or_create(user=user, match=match)
        return Response({"status": "seen"}, status=status.HTTP_200_OK)


class FomoView(APIView):
    """
    GET /api/matches/fomo/
    Повертає кількість прихованих матчів і найкращий скор серед них.
    Актуально лише для безкоштовних юзерів.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if getattr(user, "package", "free") != "free":
            return Response({"detail": "Недоступно для цього пакету."}, status=status.HTTP_403_FORBIDDEN)

        # Беремо id матчів які юзер вже бачив
        shown_ids = list(
            SeenProfile.objects
            .filter(user=user)
            .values_list("match_id", flat=True)
        )

        data = get_fomo_data(user, shown_ids)
        return Response(data, status=status.HTTP_200_OK)
