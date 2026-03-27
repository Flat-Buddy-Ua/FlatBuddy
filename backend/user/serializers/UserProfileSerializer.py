from rest_framework import serializers
from .UserPhotoSerializer import UserPhotoSerializer
from user.constants.choices import LANGUAGE_CHOICES, MBTI_CHOICES, PERSONALITY_CHOICES, UNIVERSITY_CHOICES
from user.models import UserPhoto, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):

    uploaded_photos = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )
    photos = UserPhotoSerializer(many=True, read_only=True)
    # якщо з фронта будуть надсилатись два коремі поля
    political_coordinate_economic = serializers.IntegerField(write_only=True)
    political_coordinate_social = serializers.IntegerField(write_only=True)
    political_view = serializers.JSONField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['photos', 'uploaded_photos', 'university', 'specialization', 'study_year', 'languages', 'political_coordinate_economic',
                  'political_coordinate_social', 'political_view', 'cleanliness', 'lifestyle', 'schedule', 'sleep_schedule', 'bad_habits', 'mbti', 'extra_intro_version', 'hobbies', 'bio', 'looking_for', 'user']

    def validate_university(self, value):
        key = int(value)
        if key not in UNIVERSITY_CHOICES.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")
        return UNIVERSITY_CHOICES[key]

    def validate_uploaded_photos(self, value):
        if not (1 <= len(value) <= 5):
            raise serializers.ValidationError(
                "Кількість фото має бути від 1 до 5")

        for photo in value:
            photo_validation = UserPhotoSerializer(data={'image': photo})
            if not photo_validation.is_valid():
                raise serializers.ValidationError(photo_validation.errors)
        return value

    def validate_specialization(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 50:
            raise serializers.ValidationError(
                "Має містити менше ніж 50 символів")
        return value

    def validate_study_year(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 50:
            raise serializers.ValidationError(
                "Має містити менше ніж 50 символів")
        return value

    def validate_languages(self, value):
        languages = []
        for lang in value:
            if lang not in LANGUAGE_CHOICES.keys():
                raise serializers.ValidationError(
                    "Має бути обрано дійсний варіант/варіанти зі списку")
            else:
                languages.append(LANGUAGE_CHOICES[lang])
        return languages

# Вісь X
    def validate_political_coordinate_economic(self, value):

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
        else:
            raise serializers.ValidationError(
                "Координата поза допустимим діапазоном [-100, 100]")

# Вісь Y
    def validate_political_coordinate_social(self, value):

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
        else:
            raise serializers.ValidationError(
                "Координата поза допустимим діапазоном [-100, 100]")

    def create(self, validated_data):
        # забирає з провалідованих даних поля на політичну коорд., яких нема в моделі і перезапише як масив
        economic_coordinate = validated_data.pop(
            "political_coordinate_economic", None)
        social_coordinate = validated_data.pop(
            "political_coordinate_social", None)
        uploaded_photos = validated_data.pop('uploaded_photos', None)

        validated_data['political_view'] = [
            economic_coordinate,
            social_coordinate
        ]

        profile = super().create(validated_data)

        for photo in uploaded_photos:
            UserPhoto.objects.create(user_profile=profile, image=photo)
        return profile

    def update(self, instance, validated_data):
        uploaded_photos = validated_data.pop('uploaded_photos', None)
        profile = super().update(instance, validated_data)

        if uploaded_photos is not None:
            for photo in uploaded_photos:
                UserPhoto.objects.create(user_profile=profile, image=photo)
        return profile

    def validate_cleanliness(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError(
                "Дозволені значення: 1, 2, 3, 4, 5")
        return value

    def validate_lifestyle(self, value):
        if not value.strip():
            raise serializers.ValidationError("Це поле обов'язкове")
        return value

    def validate_schedule(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 100:
            raise serializers.ValidationError(
                "Має містити менше ніж 100 символів")
        return value

    def validate_sleep_schedule(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 100:
            raise serializers.ValidationError(
                "Має містити менше ніж 100 символів")
        return value

    def validate_bad_habits(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 100:
            raise serializers.ValidationError(
                "Має містити менше ніж 100 символів")
        return value

    def validate_mbti(self, value):
        key = int(value)
        if key not in MBTI_CHOICES.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")
        return MBTI_CHOICES[key]

    def validate_extra_intro_version(self, value):
        key = int(value)
        if key not in PERSONALITY_CHOICES.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")
        return PERSONALITY_CHOICES[key]

    def validate_hobbies(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 200:
            raise serializers.ValidationError(
                "Має містити менше ніж 200 символів")
        return value

    def validate_bio(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 300:
            raise serializers.ValidationError(
                "Має містити менше ніж 300 символів")
        return value

    def validate_looking_for(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 200:
            raise serializers.ValidationError(
                "Має містити менше ніж 200 символів")
        return value