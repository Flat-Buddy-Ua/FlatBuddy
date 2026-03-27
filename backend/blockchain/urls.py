from rest_framework import routers
from django.urls import path, include
from .BlockchainView import BlockchainViewSet

router = routers.DefaultRouter()
router.register(r'', BlockchainViewSet, basename='blockchain') 

urlpatterns = [
    path('', include(router.urls)),
]