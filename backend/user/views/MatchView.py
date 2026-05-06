from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from user.models import MatchResult
from user.serializers.MatchSerializer import MatchResultSerializer

class MyMatchListView(generics.ListAPIView):
    serializer_class = MatchResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MatchResult.objects.filter(
            Q(user_1=user) | Q(user_2=user),
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
        ).order_by('-total_score')