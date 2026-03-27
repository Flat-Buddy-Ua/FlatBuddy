from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from user.views import UserViewSet, UserProfileViewSet, UserHousingViewSet
from django.views.generic import TemplateView

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('profiles', UserProfileViewSet)
router.register('housing', UserHousingViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('blockchain/', include('blockchain.urls')),
    path('', TemplateView.as_view(template_name='index.html')), 

    re_path(r'^(?!admin|api|blockchain|media).*$', 
            TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)