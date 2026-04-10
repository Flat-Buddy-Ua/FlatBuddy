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

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user-admin')
router.register('profiles', UserProfileViewSet, basename='profile-admin')
router.register('housing', UserHousingViewSet, basename='housing-admin')

user_me_view = UserViewSet.as_view({'get': 'me', 'patch': 'me'})
profile_me_view = UserProfileViewSet.as_view({'get': 'me', 'patch': 'me'})
housing_me_view = UserHousingViewSet.as_view({'get': 'me', 'patch': 'me'})


urlpatterns = [
    
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    
    path('api/profile/general/', user_me_view, name='profile-general'),
    path('api/profile/personal/', profile_me_view, name='profile-personal'),
    path('api/profile/housing/', housing_me_view, name='profile-housing'),
    
    path('', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    path('api/admin-data/', include(router.urls)),
    
    re_path(r'^(?!admin|api|media).*$',
            TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
