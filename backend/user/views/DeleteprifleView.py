from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from user.models import ProfileDeletionFeedback
from user.account import deactivate_profile


class DeleteProfileView(APIView):
    """
    DELETE /api/profile/delete/
    Body (опційно): { "reason": "found_here" | ... | null, "note": "..." }
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        reason_code = request.data.get('reason') or None
        note = request.data.get('note') or ""

        if reason_code and reason_code not in ProfileDeletionFeedback.Reason.values:
            return Response(
                {"detail": "Невідома причина видалення."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deactivate_profile(request.user, reason_code, note)

        return Response(status=status.HTTP_204_NO_CONTENT)