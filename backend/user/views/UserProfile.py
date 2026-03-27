from user.models import UserProfile
from user.serializers import UserProfileSerializer
from user.views.BaseView import BaseViewSet


class UserProfileViewSet(BaseViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer