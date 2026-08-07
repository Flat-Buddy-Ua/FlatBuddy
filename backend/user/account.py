from django.utils import timezone

from user.models import User, ProfileDeletionFeedback


def deactivate_profile(user: User, reason_code: str | None, note: str = "") -> None:
    """
    Soft-delete: деактивує акаунт, дані в БД лишаються недоторканими.

    reason_code — один з ProfileDeletionFeedback.Reason.values, або None,
    якщо юзер пропустив опитування причини.
    """
    if reason_code and reason_code not in ProfileDeletionFeedback.Reason.values:
        raise ValueError(f"Невідомий код причини: {reason_code}")

    ProfileDeletionFeedback.objects.create(
        user=user,
        user_email=user.email,
        reason_code=reason_code or None,
        note=note[:500] if note else "",
    )

    user.is_active = False
    user.is_deleted = True
    user.deleted_at = timezone.now()
    user.save(update_fields=['is_active', 'is_deleted', 'deleted_at'])