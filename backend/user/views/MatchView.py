from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from user.matching.feed_service import get_sorted_matches
from user.serializers.MatchSerializer import MatchResultSerializer


class MyMatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches    = get_sorted_matches(request.user)
        serializer = MatchResultSerializer(
            matches, many=True, context={"request": request}
        )
        return Response(serializer.data)
