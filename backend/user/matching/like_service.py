import logging
from django.db import transaction
from django.db.models import Q
from user.models import UserLike, UserMatch, MatchResult

logger = logging.getLogger(__name__)

def _ordered(id_a: int, id_b: int):
    return (id_a, id_b) if id_a < id_b else (id_b, id_a)

def handle_like(from_user, to_user) -> dict:
    if UserLike.objects.filter(from_user=from_user, to_user=to_user).exists():
        return {'status': 'already_liked', 'match_id': None}

    with transaction.atomic():
        UserLike.objects.create(from_user=from_user, to_user=to_user)
        mutual = UserLike.objects.filter(
            from_user=to_user, to_user=from_user
        ).exists()

        if not mutual:
            from user.matching.tasks import notify_new_like
            notify_new_like.delay(from_user.id, to_user.id)
            return {'status': 'liked', 'match_id': None}

        u1_id, u2_id = _ordered(from_user.id, to_user.id)
        score = None
        try:
            mr = MatchResult.objects.get(
                user_1_id=u1_id, user_2_id=u2_id, status='done'
            )
            score = mr.total_score
        except MatchResult.DoesNotExist:
            pass

        match, created = UserMatch.objects.get_or_create(
            user_1_id=u1_id,
            user_2_id=u2_id,
            defaults={'compatibility_score': score, 'is_active': True},
        )

        if not created:
            match.is_active = True
            match.compatibility_score = score
            match.save(update_fields=['is_active', 'compatibility_score'])

        if created:
            from user.matching.tasks import notify_mutual_match
            notify_mutual_match.delay(from_user.id, to_user.id)
            logger.info(f"[Likes] New match: {u1_id} ↔ {u2_id}")
        return {'status': 'match', 'match_id': match.id}

def handle_unlike(from_user, to_user) -> dict:
    deleted, _ = UserLike.objects.filter(
        from_user=from_user, to_user=to_user
    ).delete()

    if not deleted:
        return {'status': 'not_found'}

    u1_id, u2_id = _ordered(from_user.id, to_user.id)
    UserMatch.objects.filter(
        user_1_id=u1_id, user_2_id=u2_id
    ).update(is_active=False)
    return {'status': 'unliked'}

def get_incoming_likes(user):
    already_liked_back = UserLike.objects.filter(
        from_user=user
    ).values_list('to_user_id', flat=True)

    return (
        UserLike.objects
        .filter(to_user=user)
        .exclude(from_user_id__in=already_liked_back)
        .select_related('from_user__profile')
        .order_by('-created_at')
    )

def get_outgoing_likes(user):
    liked_me_back = UserLike.objects.filter(
        to_user=user
    ).values_list('from_user_id', flat=True)

    return (
        UserLike.objects
        .filter(from_user=user)
        .exclude(to_user_id__in=liked_me_back)
        .select_related('to_user__profile')
        .order_by('-created_at')
    )

def get_my_matches(user):
    return (
        UserMatch.objects
        .filter(Q(user_1=user) | Q(user_2=user), is_active=True)
        .select_related('user_1__profile', 'user_2__profile')
        .order_by('-matched_at')
    )