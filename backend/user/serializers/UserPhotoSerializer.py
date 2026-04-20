from rest_framework import serializers
from user.models import UserPhoto
from django.core.validators import FileExtensionValidator

def validate_file_size(file):
    limit = 5 * 1024 * 1024  # 5MB
    if file.size > limit:
        raise serializers.ValidationError('File size should not exceed 5MB.')

class UserPhotoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_file_size
        ]
    )

    class Meta:
        model = UserPhoto
        fields = ['id', 'image']
