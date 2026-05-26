import secrets
 
from django.conf import settings
from django.utils import timezone
 
from user.models import PaymentOrder, User, MatchResult, ProfileUnlock
 
UNLOCK_PRICE = 50_00
 
JAR_URL = f"https://send.monobank.ua/jar/{settings.MONOBANK_JAR_ID}"
 
def _get_match_for_user(user: User, match_id: int) -> MatchResult:
    return MatchResult.objects.get(
        id=match_id,
        status=MatchResult.Status.DONE,
        hard_filter_passed=True,
    )
 
def create_unlock_order(user: User, match_id: int) -> dict:
    match = _get_match_for_user(user, match_id)
 
    if match.user_1_id != user.id and match.user_2_id != user.id:
        raise ValueError("Цей матч не належить вам.")
 
    existing = ProfileUnlock.objects.filter(
        buyer=user,
        match=match,
        status=ProfileUnlock.Status.ACTIVE,
    ).first()
    if existing:
        raise ValueError("Ця анкета вже розблокована.")
    
    pending_order = PaymentOrder.objects.filter(
        user=user,
        match=match,
        status=PaymentOrder.Status.PENDING,
    ).first()
    if pending_order:
        return _build_response(pending_order)
 
    comment_id = secrets.token_urlsafe(8)
 
    order = PaymentOrder.objects.create(
        user=user,
        comment_id=comment_id,
        match=match,
        type=PaymentOrder.Type.PROFILE_UNLOCK,
        amount_expected=UNLOCK_PRICE,
    )
 
    ProfileUnlock.objects.create(
        buyer=user,
        match=match,
        order=order,
        status=ProfileUnlock.Status.PENDING,
    )
    return _build_response(order)
 
def _build_response(order: PaymentOrder) -> dict:
    return {
        "order_id":    order.id,
        "comment_id":  order.comment_id,
        "amount":      UNLOCK_PRICE / 100,          
        "jar_url":     JAR_URL,
        "instruction": f"При оплаті вкажіть коментар: {order.comment_id}",
    }
 
def activate_profile_unlock(order: PaymentOrder) -> None:
    unlock = order.profile_unlock
    unlock.activate()
 
    order.status  = PaymentOrder.Status.PAID
    order.paid_at = timezone.now()
    order.save(update_fields=['status', 'paid_at'])