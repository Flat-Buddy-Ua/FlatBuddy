from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from user.models import UserPhoto, UserProfile
from user.serializers import UserPhotoSerializer


MAX_PHOTOS_PER_PROFILE = 5


class MePhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = UserPhotoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile.photos.all()

    def perform_create(self, serializer):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        if profile.photos.count() >= MAX_PHOTOS_PER_PROFILE:
            raise ValidationError({
                "image": f"Максимум {MAX_PHOTOS_PER_PROFILE} фото на профіль."
            })
        serializer.save(user_profile=profile)


class MePhotoDestroyView(generics.DestroyAPIView):
    serializer_class = UserPhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPhoto.objects.filter(user_profile__user=self.request.user)
