from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf.urls.static import static
from user.views import UserViewSet, UserProfileViewSet, UserHousingViewSet, UserRegistrationView

from django.views.generic import TemplateView

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('profiles', UserProfileViewSet)
router.register('housing', UserHousingViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    re_path(r'^(?!admin|api|media).*$',
            TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
