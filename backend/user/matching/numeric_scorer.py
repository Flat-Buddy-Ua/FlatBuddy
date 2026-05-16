import math

def score_cleanliness(p1, p2) -> float:
    if p1.cleanliness is None or p2.cleanliness is None:
        return 50.0
    return round(max(0.0, 100.0 - abs(p1.cleanliness - p2.cleanliness) * 25), 1)

def score_smoking(p1, p2) -> float:
    if p1.smoking is None or p2.smoking is None:
        return 50.0
    diff = abs(p1.smoking - p2.smoking)
    return round(max(0.0, 100.0 - diff * 33.3), 1)

def score_partying(p1, p2) -> float:
    if p1.partying is None or p2.partying is None:
        return 50.0
    diff = abs(p1.partying - p2.partying)
    return round(max(0.0, 100.0 - diff * 33.3), 1)

def score_political(p1, p2) -> float:
    if any(v is None for v in [
        p1.political_coordinate_economic, p1.political_coordinate_social,
        p2.political_coordinate_economic, p2.political_coordinate_social,
    ]):
        return 50.0

    max_dist = math.sqrt(200**2 + 200**2)
    dist = math.sqrt(
        (p1.political_coordinate_economic - p2.political_coordinate_economic) ** 2 +
        (p1.political_coordinate_social    - p2.political_coordinate_social)    ** 2
    )
    return round(max(0.0, (1 - dist / max_dist) * 100), 1)

def score_personality(p1, p2) -> float:
    if p1.extra_intro_version is None or p2.extra_intro_version is None:
        return 50.0
    diff = abs(p1.extra_intro_version - p2.extra_intro_version)
    return round(max(0.0, 100.0 - diff * 50.0), 1)


def score_budget(h1, h2) -> float:
    if None in (h1.budget_min, h1.budget_max, h2.budget_min, h2.budget_max):
        return 50.0
    overlap = max(0, min(h1.budget_max, h2.budget_max) - max(h1.budget_min, h2.budget_min))
    union   = max(h1.budget_max, h2.budget_max) - min(h1.budget_min, h2.budget_min)
    if union <= 0:
        return 100.0
    return round((overlap / union) * 100, 1)