from user.models import User
from user.serializers import UserSerializer
from user.views.BaseView import BaseViewSet


class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer