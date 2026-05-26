import hashlib
import hmac
import json
import logging

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from user.models import PaymentOrder
from user.payment.payment import activate_profile_unlock

logger = logging.getLogger(__name__)


def _verify_signature(request) -> bool:
    signature = request.headers.get("X-Sign", "")
    if not signature:
        return False

    expected = hmac.new(
        settings.MONOBANK_WEBHOOK_SECRET.encode(),
        request.body,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


@csrf_exempt
@require_POST
def mono_webhook(request):
    if not _verify_signature(request):
        logger.warning("Monobank webhook: невірний підпис")
        return JsonResponse({"error": "forbidden"}, status=403)

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid json"}, status=400)

    statement = payload.get("data", {}).get("statementItem", {})
    if not statement:
        return JsonResponse({"ok": True})

    amount  = abs(statement.get("amount", 0))
    comment = statement.get("comment", "").strip()

    if not comment:
        logger.info("Webhook без коментаря — пропускаємо")
        return JsonResponse({"ok": True})

    try:
        order = (
            PaymentOrder.objects
            .select_related("user", "profile_unlock__match")
            .get(comment_id=comment, status=PaymentOrder.Status.PENDING)
        )
    except PaymentOrder.DoesNotExist:
        logger.warning("Webhook: ордер comment_id=%r не знайдено або вже оброблено", comment)
        return JsonResponse({"ok": True})

    if amount < order.amount_expected:
        logger.warning(
            "Webhook: недостатня сума %d < %d для order %d",
            amount, order.amount_expected, order.id,
        )
        return JsonResponse({"ok": True})

    if not hasattr(order, 'profile_unlock'):
        logger.error("Webhook: до ордера %d не прив'язаний ProfileUnlock", order.id)
        return JsonResponse({"ok": True})

    activate_profile_unlock(order)
    logger.info(
        "ProfileUnlock активовано: buyer=%d match=%d",
        order.user_id, order.match_id,
    )

    return JsonResponse({"ok": True})