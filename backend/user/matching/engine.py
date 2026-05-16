import math
import logging

from .completeness import is_profile_complete
from .hard_filters import passes_hard_filters
from .numeric_scorer import (
    score_cleanliness, score_smoking, score_partying,
    score_political, score_personality, score_budget,
)
from .llm_scorer import score_vibe, score_hobbies
from .schedule_scorer import score_schedule
from user.constants.choices import PriorityField

logger = logging.getLogger(__name__)

BASE_WEIGHTS: dict[PriorityField, float] = {
    PriorityField.VIBE:           0.25,
    PriorityField.CLEANLINESS:    0.20,
    PriorityField.SCHEDULE:       0.10,
    PriorityField.BUDGET:         0.10,
    PriorityField.HOBBIES:        0.10,
    PriorityField.SMOKING:        0.10,
    PriorityField.PARTYING:       0.05,
    PriorityField.POLITICAL_VIEW: 0.05,
    PriorityField.PERSONALITY:    0.05,
}

assert abs(sum(BASE_WEIGHTS.values()) - 1.0) < 1e-6, "BASE_WEIGHTS must sum to 1.0"

PRIORITY_BONUS_TOTAL = 0.15
MIN_WEIGHT = 0.01   
MAX_WEIGHT = 0.60  

def _normalise(weights: dict) -> dict:
    total = sum(weights.values())
    if total <= 0:
        return dict(BASE_WEIGHTS)
    return {k: v / total for k, v in weights.items()}


def _get_weights_for_user(user) -> dict:
    weights = {k: v for k, v in BASE_WEIGHTS.items()}

    try:
        priority_fields = [
            f for f in (user.priority.fields or [])
            if f in weights
        ][:3]
    except Exception:
        priority_fields = []

    if not priority_fields:
        return weights 

    n = len(priority_fields)
    bonus_per_field = PRIORITY_BONUS_TOTAL / n

    actual_bonus_given = 0.0
    for k in priority_fields:
        old = weights[k]
        new = min(old + bonus_per_field, MAX_WEIGHT)
        weights[k] = new
        actual_bonus_given += (new - old)

    non_priority = [k for k in weights if k not in priority_fields]
    total_stealable = sum(
        weights[k] - MIN_WEIGHT
        for k in non_priority
        if weights[k] > MIN_WEIGHT
    )

    if total_stealable > 0:
        steal_ratio = min(actual_bonus_given / total_stealable, 1.0)
        for k in non_priority:
            excess = weights[k] - MIN_WEIGHT
            weights[k] = MIN_WEIGHT + excess * (1 - steal_ratio)
    return _normalise(weights)


def _merge_weights(w1: dict, w2: dict) -> dict:
    all_keys = set(w1) | set(w2)
    merged = {}
    for k in all_keys:
        v1 = w1.get(k, BASE_WEIGHTS.get(k, 0.05))
        v2 = w2.get(k, BASE_WEIGHTS.get(k, 0.05))
        merged[k] = math.sqrt(v1 * v2)   

    return _normalise(merged)

def calculate_match(user1, user2) -> dict:
    complete1, missing1 = is_profile_complete(user1)
    complete2, missing2 = is_profile_complete(user2)
    if not complete1 or not complete2:
        return {
            'status':       'skipped',
            'reason':       'incomplete_profile',
            'missing_user1': missing1,
            'missing_user2': missing2,
        }

    p1, p2 = user1.profile, user2.profile
    h1, h2 = user1.housing, user2.housing

    passed, reason = passes_hard_filters(user1, user2)
    if not passed:
        return {
            'status':             'skipped',
            'hard_filter_passed': False,
            'reason':             reason,
        }

    scores = {
        PriorityField.VIBE:           score_vibe(p1, p2),
        PriorityField.SCHEDULE:       score_schedule(p1, p2),
        PriorityField.CLEANLINESS:    score_cleanliness(p1, p2),
        PriorityField.BUDGET:         score_budget(h1, h2),
        PriorityField.HOBBIES:        score_hobbies(p1, p2),
        PriorityField.SMOKING:        score_smoking(p1, p2),
        PriorityField.PARTYING:       score_partying(p1, p2),
        PriorityField.POLITICAL_VIEW: score_political(p1, p2),
        PriorityField.PERSONALITY:    score_personality(p1, p2),
    }

    w1 = _get_weights_for_user(user1)
    w2 = _get_weights_for_user(user2)
    weights = _merge_weights(w1, w2)

    total = sum(scores[k] * weights.get(k, 0.0) for k in scores)

    logger.debug(
        f"[Engine] Match {user1.id}↔{user2.id} | "
        f"total={round(total, 1)} | weights={weights}"
    )

    return {
        'status':             'done',
        'hard_filter_passed': True,
        'total_score':        round(total, 1),
        'score_vibe':         scores[PriorityField.VIBE],
        'score_schedule':     scores[PriorityField.SCHEDULE],
        'score_cleanliness':  scores[PriorityField.CLEANLINESS],
        'score_budget':       scores[PriorityField.BUDGET],
        'score_hobbies':      scores[PriorityField.HOBBIES],
        'score_smoking':      scores[PriorityField.SMOKING],
        'score_partying':     scores[PriorityField.PARTYING],
        'score_political':    scores[PriorityField.POLITICAL_VIEW],
        'score_personality':  scores[PriorityField.PERSONALITY],
    }