from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from user.matching.feed_service import get_feed, get_fomo_data
from user.models import SeenProfile, MatchResult

class FeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        feed = get_feed(request.user)

        def serialize_match(match):
            other = (
                match.user_2 if match.user_1_id == request.user.id else match.user_1
            )
            return {
                "match_id":         match.id,
                "total_score":      round(match.total_score or 0, 2),
                "other_user_id":    other.id,
                "first_name":       other.first_name,
                "photo_url": (
                    other.profile.photos.first().image.url
                    if other.profile.photos.exists() else None
                ),
            }

        teaser_data = None
        if feed["teaser"]:
            t = feed["teaser"]
            teaser_data = serialize_match(t)
            teaser_data["price_uah"] = 50

        return Response({
            "free":     [serialize_match(m) for m in feed["free"]],
            "teaser":   teaser_data,
            "unlocked": [serialize_match(m) for m in feed["unlocked"]],
        })

class MarkSeenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        try:
            match = MatchResult.objects.get(
                id=match_id,
                status=MatchResult.Status.DONE,
            )
        except MatchResult.DoesNotExist:
            return Response({"error": "Не знайдено."}, status=status.HTTP_404_NOT_FOUND)

        SeenProfile.objects.get_or_create(user=request.user, match=match)
        return Response({"ok": True})


class FomoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        raw = request.query_params.get("seen", "")
        try:
            shown_ids = [int(x) for x in raw.split(",") if x.strip()]
        except ValueError:
            shown_ids = []

        data = get_fomo_data(request.user, shown_ids)
        return Response(data)