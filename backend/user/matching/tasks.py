import logging
from celery import shared_task
from django.db.models import Q

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name='user.matching.tasks.recalculate_matches_for_user',
)
def recalculate_matches_for_user(self, user_id: int):
    from user.models import User, MatchResult
    from .engine import calculate_match
    from .llm_scorer import compute_and_cache_embeddings

    try:
        user = _get_user(user_id)
        if user is None:
            logger.warning(f"[Matching] User {user_id} not found, skipping.")
            return

        if not hasattr(user, 'housing') or user.housing is None:
            logger.warning(f"[Matching] User {user_id} has no housing, skipping.")
            return

        if not hasattr(user, 'profile') or user.profile is None:
            logger.warning(f"[Matching] User {user_id} has no profile, skipping.")
            return

        if not user.profile.embedding_vibe:
            compute_and_cache_embeddings(user.profile)
            user.profile.refresh_from_db()

        candidates = _get_candidates(user)

        MatchResult.objects.filter(
            Q(user_1_id=user_id) | Q(user_2_id=user_id)
        ).update(is_stale=True)

        updated, skipped, errors = 0, 0, 0

        for candidate in candidates:
            if not hasattr(candidate, 'profile') or candidate.profile is None:
                skipped += 1
                continue
            if not hasattr(candidate, 'housing') or candidate.housing is None:
                skipped += 1
                continue

            if not candidate.profile.embedding_vibe:
                compute_and_cache_embeddings(candidate.profile)
                candidate.profile.refresh_from_db()

            u1, u2 = _ordered_pair(user, candidate)
            try:
                result = calculate_match(u1, u2)
                _save_result(u1, u2, result)

                if result['status'] == 'done':
                    updated += 1
                else:
                    skipped += 1
            except Exception as e:
                errors += 1
                logger.error(
                    f"[Matching] Failed pair ({u1.id}, {u2.id}): {e}",
                    exc_info=True,
                )

        logger.info(
            f"[Matching] user_id={user_id} | "
            f"updated={updated} skipped={skipped} errors={errors}"
        )

    except Exception as exc:
        logger.error(
            f"[Matching] Critical error for user_id={user_id}: {exc}",
            exc_info=True,
        )
        raise self.retry(exc=exc)


@shared_task(
    name='user.matching.tasks.recompute_all_embeddings',
)
def recompute_all_embeddings():
    from user.models import UserProfile
    from .llm_scorer import compute_and_cache_embeddings

    profiles = UserProfile.objects.filter(embedding_vibe__isnull=True)
    count = 0
    for profile in profiles.iterator(chunk_size=50):
        try:
            compute_and_cache_embeddings(profile)
            count += 1
        except Exception as e:
            logger.error(f"[Embeddings] Failed profile {profile.id}: {e}", exc_info=True)

    logger.info(f"[Embeddings] Recomputed for {count} profiles.")
    return count

def _get_user(user_id: int):
    from user.models import User
    try:
        return User.objects.select_related(
            'profile', 'housing', 'priority'
        ).get(id=user_id)
    except User.DoesNotExist:
        return None


def _get_candidates(user):
    from user.models import User

    destination = user.housing.destination
    if destination is None:
        return []

    return (
        User.objects.exclude(id=user.id)
        .filter(housing__destination=destination)
        .filter(profile__isnull=False)  
        .select_related('profile', 'housing', 'priority')
        .iterator(chunk_size=50)
    )


def _ordered_pair(u1, u2):
    return (u1, u2) if u1.id < u2.id else (u2, u1)


def _save_result(u1, u2, result):
    from user.models import MatchResult

    if result['status'] == 'skipped':
        MatchResult.objects.update_or_create(
            user_1=u1, user_2=u2,
            defaults={
                'status':             MatchResult.Status.SKIPPED,
                'hard_filter_passed': result.get('hard_filter_passed', False),
                'skip_reason':        result.get('reason', '')[:50],
                'is_stale':           False,
            },
        )
    elif result['status'] == 'done':
        MatchResult.objects.update_or_create(
            user_1=u1, user_2=u2,
            defaults={
                'status':             MatchResult.Status.DONE,
                'hard_filter_passed': True,
                'skip_reason':        '',
                'total_score':        result['total_score'],
                'score_vibe':         result['score_vibe'],
                'score_schedule':     result['score_schedule'],
                'score_cleanliness':  result['score_cleanliness'],
                'score_hobbies':      result['score_hobbies'],
                'score_smoking':      result['score_smoking'],
                'score_partying':     result['score_partying'],
                'score_political':    result['score_political'],
                'score_personality':  result['score_personality'],
                'is_stale':           False,
            },
        )