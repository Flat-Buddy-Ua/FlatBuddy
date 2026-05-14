"""
feed_service.py — логіка псевдовипадкового сортування матчів.

Стратегія:
  - Безкоштовний юзер бачить 5 профілів/день (поріг 0.55+)
  - Платні пакети отримують більший пул з нижчим порогом
  - Пік якості зміщений вглиб, а не першим
  - Вже переглянуті профілі виключаються через SeenProfile
"""

import random
import math
import logging
from django.db import models as django_models

logger = logging.getLogger(__name__)

# ── Конфігурація пакетів ──────────────────────────────────────────────────
PACKAGE_CONFIG = {
    "free":    {"limit": 5,  "threshold": 55, "peak_pos": 1},
    "p25":     {"limit": 25, "threshold": 45, "peak_pos": 8},
    "p45":     {"limit": 45, "threshold": 35, "peak_pos": 16},
    "p55":     {"limit": 55, "threshold": 25, "peak_pos": 22},
    "premium": {"limit": None, "threshold": 0, "peak_pos": None},
}


def weighted_shuffle(items, score_fn):
    """
    Зважене перемішування за алгоритмом Efraimidis–Spirakis.
    Кожен елемент отримує ключ: random() ^ (1 / weight).
    Більший скор → менший степінь → в середньому більший ключ → вище в списку.
    """
    scored = []
    for item in items:
        w = max(score_fn(item) or 0.0, 0.01)
        r = random.random() ** (1.0 / w)
        scored.append((r, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored]


def place_peak(items, peak_pos):
    """
    Витягує найкращий елемент зі списку і ставить його на peak_pos (0-based).
    Решта залишається у своєму (вже зваженому) порядку.
    """
    if not items or peak_pos is None or peak_pos >= len(items):
        return items

    best_idx = max(range(len(items)), key=lambda i: items[i].total_score or 0.0)
    best = items.pop(best_idx)
    items.insert(peak_pos, best)
    return items


def _get_queryset(user, threshold):
    """
    Повертає QuerySet матчів для юзера:
    - статус DONE, hard_filter_passed=True
    - total_score >= threshold
    - виключає вже переглянуті
    """
    from user.models import MatchResult, SeenProfile

    seen_ids = (
        SeenProfile.objects
        .filter(user=user)
        .values_list("match_id", flat=True)
    )

    return (
        MatchResult.objects
        .filter(
            django_models.Q(user_1=user) | django_models.Q(user_2=user),
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
            total_score__gte=threshold,
        )
        .exclude(id__in=seen_ids)
        .select_related(
            "user_1__profile", "user_2__profile",
            "user_1__housing",  "user_2__housing",
        )
        .prefetch_related(
            "user_1__profile__photos",
            "user_2__profile__photos",
        )
    )


def get_sorted_matches(user):
    """
    Головна функція. Повертає відсортований список матчів
    відповідно до пакету юзера.
    """
    package = getattr(user, "package", "free") or "free"
    config  = PACKAGE_CONFIG.get(package, PACKAGE_CONFIG["free"])

    limit     = config["limit"]
    threshold = config["threshold"]
    peak_pos  = config["peak_pos"]

    qs      = _get_queryset(user, threshold)
    matches = list(qs)

    if not matches:
        return []

    # Преміум — просто зважене перемішування без обмежень
    if package == "premium":
        return weighted_shuffle(matches, score_fn=lambda m: m.total_score)

    # Зважене перемішування → обрізаємо до ліміту → ставимо пік
    shuffled = weighted_shuffle(matches, score_fn=lambda m: m.total_score)
    sliced   = shuffled[:limit]
    result   = place_peak(sliced, peak_pos)

    logger.debug(
        "[feed] user=%s package=%s total=%d shown=%d",
        user.id, package, len(matches), len(result),
    )
    return result


def get_fomo_data(user, shown_match_ids):
    """
    Дані для FOMO-блоку після безкоштовних профілів.
    Повертає кількість прихованих матчів і найкращий скор серед них.
    Актуально лише для пакету 'free'.
    """
    from user.models import MatchResult

    hidden_qs = (
        MatchResult.objects
        .filter(
            django_models.Q(user_1=user) | django_models.Q(user_2=user),
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
        )
        .exclude(id__in=shown_match_ids)
    )

    count      = hidden_qs.count()
    best_score = (
        hidden_qs
        .order_by("-total_score")
        .values_list("total_score", flat=True)
        .first()
    )

    return {
        "hidden_count": count,
        "best_score":   round(best_score, 2) if best_score is not None else None,
    }
