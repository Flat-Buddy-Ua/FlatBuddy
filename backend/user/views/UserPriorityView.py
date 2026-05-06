from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from user.models import UserPriority
from user.serializers.UserPrioritySerializer import UserPrioritySerializer

class MePriorityView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPrioritySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = UserPriority.objects.get_or_create(user=self.request.user)
        return obj