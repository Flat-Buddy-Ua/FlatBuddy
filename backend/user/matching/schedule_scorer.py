import re
import logging

logger = logging.getLogger(__name__)

_TIME_RANGE_RE = re.compile(
    r'(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})'
)

def _parse_sleep_schedule(text: str):
    if not text:
        return None, None

    m = _TIME_RANGE_RE.search(text)
    if not m:
        return None, None

    sleep_h, sleep_m, wake_h, wake_m = (int(x) for x in m.groups())
    sleep = sleep_h + sleep_m / 60.0
    wake  = wake_h  + wake_m  / 60.0
    return sleep, wake

def _circular_diff(a: float, b: float, cycle: float = 24.0) -> float:
    diff = abs(a - b) % cycle
    return min(diff, cycle - diff)


def _hours_to_score(diff_hours: float, max_diff: float = 3.0) -> float:
    return round(max(0.0, (1.0 - diff_hours / max_diff)) * 100, 1)


def score_schedule(p1, p2) -> float:
    sleep1, wake1 = _parse_sleep_schedule(p1.sleep_schedule)
    sleep2, wake2 = _parse_sleep_schedule(p2.sleep_schedule)

    if sleep1 is not None and sleep2 is not None:
        parts = []

        diff_sleep = _circular_diff(sleep1, sleep2)
        parts.append(_hours_to_score(diff_sleep, max_diff=3.0))

        if wake1 is not None and wake2 is not None:
            diff_wake = _circular_diff(wake1, wake2)
            parts.append(_hours_to_score(diff_wake, max_diff=3.0))

        score = round(sum(parts) / len(parts), 1)

        logger.debug(
            f"[Schedule] p1={p1.id} sleep={sleep1:.2f} wake={wake1} | "
            f"p2={p2.id} sleep={sleep2:.2f} wake={wake2} | "
            f"score={score}"
        )
        return score

    if p1.embedding_schedule and p2.embedding_schedule:
        logger.debug(
            f"[Schedule] p1={p1.id}/p2={p2.id}: regex failed, using embedding fallback"
        )
        from .llm_scorer import _cosine, _to_score
        raw = _cosine(p1.embedding_schedule, p2.embedding_schedule)
        return _to_score(raw, low=0.78, high=0.98)

    return 50.0