import logging
from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

EMBEDDING_FIELDS = {
    'my_vibe', 'buddy_vibe', 'schedule', 'sleep_schedule', 'hobbies',
}

MATCH_TRIGGER_FIELDS = EMBEDDING_FIELDS | {
    'cleanliness', 'smoking', 'partying', 'extra_intro_version',
    'political_coordinate_economic', 'political_coordinate_social',
}

def connect_signals():
    from user.models import UserProfile, UserHousing, UserPriority, UserMatch, MatchReport

    @receiver(post_save, sender=UserProfile)
    def on_profile_save(sender, instance, created, update_fields, **kwargs):
        from user.matching.tasks import recalculate_matches_for_user
        EMBEDDING_ONLY_FIELDS = {
            'embedding_vibe', 'embedding_hobbies',
            'embedding_schedule', 'embedding_updated_at',
        }
        if update_fields is not None and set(update_fields) <= EMBEDDING_ONLY_FIELDS:
            logger.debug(
                f"[Signals] Profile {instance.pk}: embedding-only save, skipping."
            )
            return

        changed = set(update_fields) if update_fields is not None else MATCH_TRIGGER_FIELDS
        needs_embedding_reset = bool(changed & EMBEDDING_FIELDS)

        if needs_embedding_reset:
            UserProfile.objects.filter(pk=instance.pk).update(
                embedding_vibe=None,
                embedding_hobbies=None,
                embedding_schedule=None,
                parsed_wake_hour=None,   
                parsed_sleep_hour=None,
            )
            logger.debug(
                f"[Signals] Profile {instance.pk}: embeddings cleared."
            )

        try:
            recalculate_matches_for_user.delay(instance.user_id)
            logger.debug(
                f"[Signals] Profile {'created' if created else 'updated'} "
                f"→ task queued for user {instance.user_id}"
            )
        except Exception:
            # Broker (Redis/RabbitMQ) недоступний — save вже відбувся, не валимо API.
            logger.exception(
                "[Signals] Failed to enqueue matching recalc for user %s",
                instance.user_id,
            )

    @receiver(post_save, sender=UserHousing)
    def on_housing_save(sender, instance, created, **kwargs):
        from user.matching.tasks import recalculate_matches_for_user
        from django.db.models import Q
        from user.models import MatchResult

        try:
            recalculate_matches_for_user.delay(instance.user_id)
            logger.debug(
                f"[Signals] Housing {'created' if created else 'updated'} "
                f"→ task queued for user {instance.user_id}"
            )
        except Exception:
            logger.exception(
                "[Signals] Failed to enqueue matching recalc for user %s",
                instance.user_id,
            )
 
        stale_partner_ids = (
            MatchResult.objects.filter(
                Q(user_1_id=instance.user_id) | Q(user_2_id=instance.user_id),
                status=MatchResult.Status.DONE,
            ).values_list('user_1_id', 'user_2_id')
        )
 
        partner_ids = set()
        for u1_id, u2_id in stale_partner_ids:
            other = u2_id if u1_id == instance.user_id else u1_id
            partner_ids.add(other)
 
        for partner_id in partner_ids:
            try:
                recalculate_matches_for_user.delay(partner_id)
            except Exception:
                logger.exception(
                    "[Signals] Failed to enqueue matching recalc for partner %s",
                    partner_id,
                )
 
        logger.debug(
            f"[Signals] Housing updated for user {instance.user_id} "
            f"→ triggered recalc for {len(partner_ids)} partners"
        )
 
    @receiver(post_save, sender=UserPriority)
    def on_priority_save(sender, instance, created, **kwargs):
        from user.matching.tasks import recalculate_matches_for_user
 
        try:
            recalculate_matches_for_user.delay(instance.user_id)
            logger.debug(
                f"[Signals] Priority {'created' if created else 'updated'} "
                f"→ task queued for user {instance.user_id}"
            )
        except Exception:
            logger.exception(
                "[Signals] Failed to enqueue matching recalc for user %s",
                instance.user_id,
            )

    @receiver(post_save, sender=UserMatch)
    def create_match_report(sender, instance: UserMatch, created: bool, **kwargs):
        if not created:
            return 

        MatchReport.objects.update_or_create(
            user_match=instance,
            defaults={
                'user_1_id_ref':     instance.user_1_id,
                'user_1_first_name': instance.user_1.first_name,
                'user_1_last_name':  instance.user_1.last_name,
                'user_2_id_ref':     instance.user_2_id,
                'user_2_first_name': instance.user_2.first_name,
                'user_2_last_name':  instance.user_2.last_name,
                'compatibility_score': instance.compatibility_score,
                'matched_at':        instance.matched_at,
            }
        )