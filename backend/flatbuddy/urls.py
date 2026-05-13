from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf.urls.static import static

from user.views.UserView import UserViewSet, MeUserView
from user.views.UserProfileView import UserProfileViewSet, MeProfileView
from user.views.UserHousingView import UserHousingViewSet, MeHousingView
from user.views.UserRegistrationView import UserRegistrationView
from user.views.VerifyMagicLinkView import VerifyMagicLinkView
from user.views.ResendMagicLinkView import ResendMagicLinkView
from user.views.MatchView import MyMatchListView
from user.views.FeedView import MarkSeenView, FomoView

from user.views.UserPhotoView import MePhotoListCreateView, MePhotoDestroyView
from user.views.LikeView import (
    LikeCreateView, LikeDeleteView, IncomingLikesView, OutgoingLikesView, MyMatchesView,
)
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user-admin')
router.register('profiles', UserProfileViewSet, basename='profile-admin')
router.register('housing', UserHousingViewSet, basename='housing-admin')

urlpatterns = [
    
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/verify/<token>/', VerifyMagicLinkView.as_view(), name='verify'),
    path('api/resend-link/', ResendMagicLinkView.as_view(), name='resend-link'),


    path('api/profile/general/', MeUserView.as_view(), name='profile-general'),
    path('api/profile/personal/', MeProfileView.as_view(), name='profile-personal'),
    path('api/profile/housing/', MeHousingView.as_view(), name='profile-housing'),
    path('api/profile/photos/', MePhotoListCreateView.as_view(), name='profile-photos-list'),
    path('api/profile/photos/<int:pk>/', MePhotoDestroyView.as_view(), name='profile-photos-detail'),


    path('api/likes/',                         LikeCreateView.as_view(),    name='like-create'),
    path('api/likes/incoming/',                IncomingLikesView.as_view(), name='likes-incoming'),
    path('api/likes/outgoing/',                OutgoingLikesView.as_view(), name='likes-outgoing'),
    path('api/likes/<int:user_id>/',           LikeDeleteView.as_view(),    name='like-delete'),
    path('api/matches/',                       MyMatchListView.as_view(),   name='matches-list'),
    path('api/matches/fomo/',                  FomoView.as_view(),          name='matches-fomo'),
    path('api/matches/<int:match_id>/seen/',   MarkSeenView.as_view(),      name='matches-seen'),
    path('api/user-matches/',                  MyMatchesView.as_view(),     name='user-matches'),

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
