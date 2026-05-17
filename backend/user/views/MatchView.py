import logging

from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from user.matching.feed_service import get_sorted_matches
from user.models import MatchResult, SeenProfile
from user.serializers.MatchSerializer import MatchResultSerializer

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
        matches    = get_sorted_matches(request.user)
        serializer = MatchResultSerializer(
            matches, many=True, context={"request": request}
        )
        return Response(serializer.data)


class MyMatchDetailView(APIView):
    """
    GET /api/matches/<match_id>/

    Повертає один MatchResult із поточними скорами. Якщо матч застарів або
    ще не порахований — перераховує синхронно. Чужі матчі недоступні
    (403). Безкоштовний пакет отримує матч, який ще не «бачив», без скорів.
    """
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
            match = self._recompute(match)

        if match.status == MatchResult.Status.SKIPPED:
            raise NotFound("Матч недоступний.")
        if match.status != MatchResult.Status.DONE:
            raise NotFound("Матч ще не готовий.")

        data = MatchResultSerializer(match, context={"request": request}).data

        scores_locked = self._scores_locked(user, match)
        if scores_locked:
            for f in SCORE_FIELDS:
                data[f] = None
        data["scores_locked"] = scores_locked

        return Response(data, status=status.HTTP_200_OK)

    # ── helpers ──────────────────────────────────────────────────────────

    def _recompute(self, match: MatchResult) -> MatchResult:
        from user.matching.engine import calculate_match
        from user.matching.tasks import _save_result
        from user.matching.llm_scorer import compute_and_cache_embeddings

        u1, u2 = match.user_1, match.user_2

        for u in (u1, u2):
            profile = getattr(u, "profile", None)
            if profile is None:
                continue
            if not profile.embedding_vibe:
                try:
                    compute_and_cache_embeddings(profile)
                    profile.refresh_from_db()
                except Exception:
                    logger.exception(
                        "[MatchDetail] embedding compute failed for user %s",
                        u.id,
                    )

        try:
            result = calculate_match(u1, u2)
            _save_result(u1, u2, result)
        except Exception:
            logger.exception(
                "[MatchDetail] sync recompute failed for match %s", match.pk
            )

        match.refresh_from_db()
        return match

    def _scores_locked(self, user, match: MatchResult) -> bool:
        if (getattr(user, "package", "free") or "free") != "free":
            return False
        return not SeenProfile.objects.filter(user=user, match=match).exists()
