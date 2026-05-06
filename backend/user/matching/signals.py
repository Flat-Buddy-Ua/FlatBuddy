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
    from user.models import UserProfile, UserHousing, UserPriority

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

        recalculate_matches_for_user.delay(instance.user_id)
        logger.debug(
            f"[Signals] Profile {'created' if created else 'updated'} "
            f"→ task queued for user {instance.user_id}"
        )

    @receiver(post_save, sender=UserHousing)
    def on_housing_save(sender, instance, created, **kwargs):
        from user.matching.tasks import recalculate_matches_for_user

        recalculate_matches_for_user.delay(instance.user_id)
        logger.debug(
            f"[Signals] Housing {'created' if created else 'updated'} "
            f"→ task queued for user {instance.user_id}"
        )

    @receiver(post_save, sender=UserPriority)
    def on_priority_save(sender, instance, created, **kwargs):
        from user.matching.tasks import recalculate_matches_for_user

        recalculate_matches_for_user.delay(instance.user_id)
        logger.debug(
            f"[Signals] Priority {'created' if created else 'updated'} "
            f"→ task queued for user {instance.user_id}"
        )