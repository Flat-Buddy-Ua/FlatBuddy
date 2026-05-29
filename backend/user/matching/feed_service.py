import random
import logging

from django.db import models as django_models
from django.utils import timezone

from user.models import MatchResult, SeenProfile, ProfileUnlock, User

logger = logging.getLogger(__name__)

FREE_CARDS_COUNT   = 5
FREE_SCORE_MIN     = 30         
FREE_SCORE_MAX     = 60        
TEASER_SCORE_MIN   = 70     

PLAN_DAILY_LIMITS = {
    User.Package.FREE: 5,
    User.Package.P25: 25,
    User.Package.P45: 45,
    User.Package.P55: 55,
    User.Package.PREMIUM: None,
}


def _base_qs(user):
    return (
        MatchResult.objects
        .filter(
            django_models.Q(user_1=user) | django_models.Q(user_2=user),
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
        )
        .select_related(
            "user_1__profile", "user_2__profile",
            "user_1__housing",  "user_2__housing",
        )
        .prefetch_related(
            "user_1__profile__photos",
            "user_2__profile__photos",
        )
    )

def _seen_match_ids(user):
    return set(
        SeenProfile.objects
        .filter(user=user)
        .values_list("match_id", flat=True)
    )

def _unlocked_match_ids(user):
    return set(
        ProfileUnlock.objects
        .filter(buyer=user, status=ProfileUnlock.Status.ACTIVE)
        .values_list("match_id", flat=True)
    )


def _daily_limit(user):
    package = getattr(user, "package", User.Package.FREE) or User.Package.FREE
    return PLAN_DAILY_LIMITS.get(package, PLAN_DAILY_LIMITS[User.Package.FREE])


def _today_seen_count(user):
    today = timezone.localdate()
    return (
        SeenProfile.objects
        .filter(user=user, seen_at__date=today)
        .count()
    )


def _daily_usage(user):
    limit = _daily_limit(user)
    viewed = _today_seen_count(user)
    remaining = None if limit is None else max(limit - viewed, 0)
    return {
        "daily_limit": limit,
        "daily_viewed": viewed,
        "daily_remaining": remaining,
        "daily_limit_reached": limit is not None and remaining <= 0,
        "fomo_enabled": limit is not None,
    }


def _weighted_sample(items, score_fn, k):
    if not items or k <= 0:
        return []

    scored = []
    for item in items:
        w = max(score_fn(item) or 0.0, 0.01)
        key = random.random() ** (1.0 / w)
        scored.append((key, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored[:k]]

def get_feed(user) -> dict:
    seen_ids     = _seen_match_ids(user)
    unlocked_ids = _unlocked_match_ids(user)
    base_qs      = _base_qs(user)
    daily        = _daily_usage(user)

    unlocked_matches = list(
        base_qs.filter(id__in=unlocked_ids)
        .order_by("-total_score")
    )
    excluded_ids = seen_ids | unlocked_ids
    cards_limit = FREE_CARDS_COUNT
    if daily["daily_remaining"] is not None:
        cards_limit = min(cards_limit, daily["daily_remaining"])

    free_pool = list(
        base_qs
        .filter(
            total_score__gte=FREE_SCORE_MIN,
            total_score__lte=FREE_SCORE_MAX,
        )
        .exclude(id__in=excluded_ids)
    )

    free_matches = _weighted_sample(
        free_pool,
        score_fn=lambda m: m.total_score,
        k=cards_limit,
    )
    teaser_excluded = seen_ids | unlocked_ids | {m.id for m in free_matches}
    teaser_slots = cards_limit - len(free_matches)

    teaser = None
    if teaser_slots > 0:
        teaser = (
            base_qs
            .filter(total_score__gte=TEASER_SCORE_MIN)
            .exclude(id__in=teaser_excluded)
            .order_by("-total_score")
            .first()
        )

    logger.debug(
        "[feed] user=%d free=%d teaser=%s unlocked=%d viewed=%d limit=%s",
        user.id,
        len(free_matches),
        teaser.id if teaser else None,
        len(unlocked_matches),
        daily["daily_viewed"],
        daily["daily_limit"],
    )

    return {
        "free":     free_matches,
        "teaser":   teaser,
        "unlocked": unlocked_matches,
        "meta":      daily,
    }

def get_fomo_data(user, shown_match_ids: list) -> dict:
    daily = _daily_usage(user)
    if not daily["fomo_enabled"]:
        return {
            **daily,
            "hidden_count": 0,
            "best_score": None,
            "show_fomo": False,
        }

    if not daily["daily_limit_reached"]:
        return {
            **daily,
            "hidden_count": 0,
            "best_score": None,
            "show_fomo": False,
        }

    unlocked_ids = _unlocked_match_ids(user)
    excluded     = set(shown_match_ids) | unlocked_ids | _seen_match_ids(user)

    hidden_qs = (
        MatchResult.objects
        .filter(
            django_models.Q(user_1=user) | django_models.Q(user_2=user),
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
            total_score__gte=TEASER_SCORE_MIN,
        )
        .exclude(id__in=excluded)
    )

    count      = hidden_qs.count()
    best_score = (
        hidden_qs
        .order_by("-total_score")
        .values_list("total_score", flat=True)
        .first()
    )

    return {
        **daily,
        "hidden_count": count,
        "best_score":   round(best_score, 2) if best_score is not None else None,
        "show_fomo":    True,
    }
