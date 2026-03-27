from rest_framework import serializers
from user.models import UserPhoto
from django.core.validators import FileExtensionValidator


class UserPhotoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        validators=[FileExtensionValidator(
            allowed_extensions=['jpg', 'jpeg', 'png'])]
    )

    class Meta:
        model = UserPhoto
        fields = ['image']