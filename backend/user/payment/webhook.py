import json
import logging
import os

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from user.models import PaymentOrder
from user.payment.payment import activate_profile_unlock

logger = logging.getLogger(__name__)

@csrf_exempt
@require_POST
def mono_webhook(request):
    incoming_token = request.GET.get("token")
    if not incoming_token or incoming_token != os.getenv("MONOBANK_WEBHOOK_SECRET"):
        logger.warning(f"Спроба доступу з неправильним токеном: {incoming_token}")
        return JsonResponse({"error": "forbidden"}, status=403)

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        logger.error("Монобанк надіслав невалідний JSON")
        return JsonResponse({"error": "invalid json"}, status=400)

    statement = payload.get("data", {}).get("statementItem", {})
    
    if not statement:
        return JsonResponse({"ok": True})

    amount = abs(statement.get("amount", 0))
    comment = statement.get("comment", "").strip()

    if not comment:
        logger.info("Платіж без коментаря — пропускаємо")
        return JsonResponse({"ok": True})
    try:
        order = (
            PaymentOrder.objects
            .select_related("user", "profile_unlock__match")
            .get(comment_id=comment, status=PaymentOrder.Status.PENDING)
        )
    except PaymentOrder.DoesNotExist:
        logger.warning(f"Ордер з коментарем '{comment}' не знайдено або вже оплачено")
        return JsonResponse({"ok": True})

    if amount < order.amount_expected:
        logger.warning(f"Недостатня сума для ордера {order.id}: очікувалось {order.amount_expected}, прийшло {amount}")
        return JsonResponse({"ok": True})

    if not hasattr(order, 'profile_unlock'):
        return JsonResponse({"ok": True})

    activate_profile_unlock(order)
    logger.info(f"Профіль успішно активовано по вебхуку для ордера {order.id}")

    return JsonResponse({"ok": True})