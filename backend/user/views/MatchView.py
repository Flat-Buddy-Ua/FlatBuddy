import logging

from django.db import models as django_models
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from user.models import MatchResult, SeenProfile, ProfileUnlock
from user.matching.feed_service import FREE_SCORE_MAX, FREE_SCORE_MIN, _daily_usage
from user.serializers.MatchSerializer import MatchResultSerializer

from user.matching.engine import calculate_match
from user.matching.tasks import _save_result, _ordered_pair

logger = logging.getLogger(__name__)


SCORE_FIELDS = (
    "total_score",
    "score_vibe", "score_schedule", "score_cleanliness", "score_budget",
    "score_hobbies", "score_smoking", "score_partying",
    "score_political", "score_personality",
)

class MyMatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unlocked_match_ids = ProfileUnlock.objects.filter(
            buyer=request.user,
            status=ProfileUnlock.Status.ACTIVE
        ).values_list('match_id', flat=True)

        matches = MatchResult.objects.filter(
            django_models.Q(user_1=request.user) | django_models.Q(user_2=request.user),
            id__in=unlocked_match_ids,
            status=MatchResult.Status.DONE
        ).select_related('user_1', 'user_2')

        results = []
        for match in matches:
            other_user = match.user_2 if match.user_1_id == request.user.id else match.user_1
            results.append({
                "match_id": match.id,
                "total_score": round(match.total_score or 0, 2),
                "other_user_id": other_user.id,
                "first_name": other_user.first_name,
                "last_name": other_user.last_name,
                "email": other_user.email,
                "phone_number": other_user.phone_number
            })

        return Response(results, status=status.HTTP_200_OK)


def recompute_match(match: MatchResult) -> MatchResult:
    u1, u2 = _ordered_pair(match.user_1, match.user_2)
    try:
        result = calculate_match(u1, u2)
        _save_result(u1, u2, result)
        match.refresh_from_db()
    except Exception as e:
        logger.error(f"[recompute_match] Failed ({u1.id}, {u2.id}): {e}", exc_info=True)
    return match


class MyMatchDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, match_id: int):
        try:
            match = (
                MatchResult.objects
                .select_related(
                    "user_1__profile", "user_2__profile",
                    "user_1__housing",  "user_2__housing",
                )
                .prefetch_related(
                    "user_1__profile__photos",
                    "user_2__profile__photos",
                )
                .get(pk=match_id)
            )
        except MatchResult.DoesNotExist:
            raise NotFound("Матч не знайдено.")

        user = request.user
        if match.user_1_id != user.id and match.user_2_id != user.id:
            raise PermissionDenied("Немає доступу до цього матчу.")

        if match.is_stale or match.status in (
            MatchResult.Status.PENDING,
            MatchResult.Status.ERROR,
        ):
            match = recompute_match(match)

        if match.status == MatchResult.Status.SKIPPED:
            raise NotFound("Матч недоступний.")
        if match.status != MatchResult.Status.DONE:
            raise NotFound("Матч ще не готовий.")

        data = serialize_accessible_match(user, match, request)

        return Response(data, status=status.HTTP_200_OK)


class MyMatchByUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id: int):
        user = request.user
        try:
            match = (
                MatchResult.objects
                .select_related(
                    "user_1__profile", "user_2__profile",
                    "user_1__housing",  "user_2__housing",
                )
                .prefetch_related(
                    "user_1__profile__photos",
                    "user_2__profile__photos",
                )
                .get(
                    django_models.Q(user_1=user, user_2_id=user_id) |
                    django_models.Q(user_2=user, user_1_id=user_id)
                )
            )
        except MatchResult.DoesNotExist:
            raise NotFound("Матч не знайдено.")

        if match.is_stale or match.status in (
            MatchResult.Status.PENDING,
            MatchResult.Status.ERROR,
        ):
            match = recompute_match(match)

        if match.status == MatchResult.Status.SKIPPED:
            raise NotFound("Матч недоступний.")
        if match.status != MatchResult.Status.DONE:
            raise NotFound("Матч ще не готовий.")

        data = serialize_accessible_match(user, match, request)

        return Response(data, status=status.HTTP_200_OK)

def serialize_accessible_match(user, match: MatchResult, request) -> dict:
    access = _access_state(user, match)
    if not access["can_view"]:
        raise NotFound("Матч недоступний.")

    if access["counts_as_view"]:
        SeenProfile.objects.get_or_create(user=user, match=match)

    data = MatchResultSerializer(match, context={"request": request}).data

    if access["scores_locked"]:
        for f in SCORE_FIELDS:
            data[f] = None
    data["scores_locked"] = access["scores_locked"]

    return data


def _access_state(user, match: MatchResult) -> dict:
    package = getattr(user, "package", "free") or "free"
    is_free = package == "free"
    is_unlimited = package == "premium"
    is_unlocked = ProfileUnlock.objects.filter(
        buyer=user,
        match=match,
        status=ProfileUnlock.Status.ACTIVE,
    ).exists()
    already_seen = SeenProfile.objects.filter(user=user, match=match).exists()

    if is_unlocked:
        return {
            "can_view": True,
            "counts_as_view": False,
            "scores_locked": False,
        }

    score = match.total_score or 0
    if is_free and not (FREE_SCORE_MIN <= score <= FREE_SCORE_MAX):
        return {
            "can_view": False,
            "counts_as_view": False,
            "scores_locked": True,
        }

    daily = _daily_usage(user)
    if not already_seen and not is_unlimited and daily["daily_limit_reached"]:
        return {
            "can_view": False,
            "counts_as_view": False,
            "scores_locked": False,
        }

    return {
        "can_view": True,
        "counts_as_view": not already_seen and not is_unlocked,
        "scores_locked": False,
    }
