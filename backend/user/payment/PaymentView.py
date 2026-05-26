from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from user.payment.payment import create_unlock_order, UNLOCK_PRICE
from user.models import PaymentOrder, ProfileUnlock, MatchResult


class InitiateUnlockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        match_id = request.data.get("match_id")

        if not match_id:
            return Response(
                {"error": "Поле match_id обов'язкове."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            match_id = int(match_id)
        except (TypeError, ValueError):
            return Response(
                {"error": "match_id має бути цілим числом."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = create_unlock_order(request.user, match_id)
        except MatchResult.DoesNotExist:
            return Response(
                {"error": "Матч не знайдено або недоступний."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(data, status=status.HTTP_201_CREATED)


class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, comment_id):
        try:
            order = request.user.payment_orders.select_related('match').get(
                comment_id=comment_id,
            )
        except PaymentOrder.DoesNotExist:
            return Response({"error": "Не знайдено."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "status":    order.status,
            "match_id":  order.match_id,
            "amount":    order.amount_expected / 100,
            "paid_at":   order.paid_at,
        })

class UnlockedProfilesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        match_ids = (
            ProfileUnlock.objects
            .filter(buyer=request.user, status=ProfileUnlock.Status.ACTIVE)
            .values_list('match_id', flat=True)
        )
        return Response({"unlocked_match_ids": list(match_ids)})


class UnlockPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"price_uah": UNLOCK_PRICE / 100})