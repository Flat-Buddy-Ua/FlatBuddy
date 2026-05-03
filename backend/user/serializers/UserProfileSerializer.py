from rest_framework import serializers
from .UserPhotoSerializer import UserPhotoSerializer
from user.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):

    photos = UserPhotoSerializer(many=True, read_only=True)

    political_coordinate_economic = serializers.IntegerField(
        min_value=-100, max_value=100, allow_null=True, required=False,
    )
    political_coordinate_social = serializers.IntegerField(
        min_value=-100, max_value=100, allow_null=True, required=False,
    )

    political_coordinate_economic_label = serializers.SerializerMethodField()
    political_coordinate_social_label = serializers.SerializerMethodField()

    cleanliness = serializers.IntegerField(
        min_value=1, max_value=5, allow_null=True, required=False,
    )

    class Meta:
        model = UserProfile
        fields = ['photos', 'status', 'orbit', 'languages',
                  'political_coordinate_economic', 'political_coordinate_economic_label',
                  'political_coordinate_social', 'political_coordinate_social_label',
                  'cleanliness', 'my_vibe', 'buddy_vibe', 'schedule',
                  'sleep_schedule', 'smoking', 'partying', 'extra_intro_version',
                  'hobbies', 'custom_hobbies', 'user']
        read_only_fields = [
            'photos', 'user',
            'political_coordinate_economic_label',
            'political_coordinate_social_label',
        ]

    # Вісь X
    def get_political_coordinate_economic_label(self, obj):
        value = obj.political_coordinate_economic

        if value is None:
            return None

        if -100 <= value < -60:
            return "Ультралівий"
        elif -60 <= value < -15:
            return "Помірковано лівий"
        elif -15 <= value <= 15:
            return "Центрист"
        elif 15 < value <= 60:
            return "Помірковано правий"
        elif 60 < value <= 100:
            return "Ультраправий"

        return "Хтозна..."

    # Вісь Y
    def get_political_coordinate_social_label(self, obj):
        value = obj.political_coordinate_social

        if value is None:
            return None

        if -100 <= value < -60:
            return "Ультраліберальний"
        elif -60 <= value < -15:
            return "Поміркований ліберальний"
        elif -15 <= value <= 15:
            return "Центрист"
        elif 15 < value <= 60:
            return "Поміркований авторитарний"
        elif 60 < value <= 100:
            return "Ультраавторитарний"

        return "Хтозна..."
