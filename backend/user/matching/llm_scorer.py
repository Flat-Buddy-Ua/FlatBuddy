import logging
import numpy as np
from django.utils import timezone

logger = logging.getLogger(__name__)

_model = None
_MODEL_NAME = 'paraphrase-multilingual-MiniLM-L12-v2'
_EMBEDDING_DIM = 384  

def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info(f"[LLM] Loading model {_MODEL_NAME}...")
        _model = SentenceTransformer(_MODEL_NAME)
        logger.info("[LLM] Model loaded.")
    return _model

def _cosine(v1: list | np.ndarray, v2: list | np.ndarray) -> float:
    a = np.asarray(v1, dtype=np.float32)
    b = np.asarray(v2, dtype=np.float32)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom < 1e-9:
        return 0.0
    return float(np.dot(a, b) / denom)

def _to_score(raw: float, low: float, high: float) -> float:
    if high <= low:
        return 50.0
    score = (raw - low) / (high - low)
    return round(max(0.0, min(1.0, score)) * 100, 1)

def _build_texts(profile) -> dict[str, str]:
    from user.constants.choices import Hobby

    hobby_labels = []
    for h in (profile.hobbies or []):
        try:
            hobby_labels.append(Hobby(h).label)
        except ValueError:
            continue
    hobby_text = ', '.join(hobby_labels)

    return {
        'vibe':     (
            f"Стиль життя: {profile.my_vibe or ''} "
            f"Шукаю: {profile.buddy_vibe or ''}"
        ),
        'hobbies':  f"Мої захоплення: {hobby_text}",
        'schedule': (
            f"Мій графік: {profile.schedule or ''}. "
            f"Режим сну: {profile.sleep_schedule or ''}"
        ),
    }

def compute_and_cache_embeddings(profile) -> None:
    texts = _build_texts(profile)
    keys  = list(texts.keys())     
    batch = list(texts.values())

    model = get_model()
    embeddings = model.encode(batch, convert_to_numpy=True)  

    profile.embedding_vibe     = embeddings[0].tolist()
    profile.embedding_hobbies  = embeddings[1].tolist()
    profile.embedding_schedule = embeddings[2].tolist()
    profile.embedding_updated_at = timezone.now()

    profile.save(update_fields=[
        'embedding_vibe',
        'embedding_hobbies',
        'embedding_schedule',
        'embedding_updated_at',
    ])
    logger.debug(f"[LLM] Embeddings cached for profile {profile.id}")


def score_vibe(p1, p2) -> float:
    if not p1.embedding_vibe or not p2.embedding_vibe:
        logger.warning(
            f"[LLM] score_vibe: missing embeddings "
            f"(p1={p1.id}, p2={p2.id}), returning 50.0"
        )
        return 50.0

    raw = _cosine(p1.embedding_vibe, p2.embedding_vibe)
    return _to_score(raw, low=0.55, high=0.85)

def score_hobbies(p1, p2) -> float:
    if not p1.embedding_hobbies or not p2.embedding_hobbies:
        return 50.0

    raw = _cosine(p1.embedding_hobbies, p2.embedding_hobbies)
    return _to_score(raw, low=0.40, high=0.70)