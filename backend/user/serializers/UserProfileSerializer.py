from rest_framework import serializers
from .UserPhotoSerializer import UserPhotoSerializer
from user.constants.choices import LANGUAGE_CHOICES, MBTI_CHOICES, PERSONALITY_CHOICES, UNIVERSITY_CHOICES
from user.models import UserPhoto, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):

    photo = serializers.ListField(

        child=serializers.ImageField(),
        write_only=True,
        required=True
    )
    photos = UserPhotoSerializer(many=True, read_only=True)

    political_coordinate_economic = serializers.IntegerField(write_only=True)
    political_coordinate_social = serializers.IntegerField(write_only=True)
    political_view = serializers.JSONField(read_only=True)

    faculty = serializers.CharField(source="specialization")
    course = serializers.CharField(source="study_year")
    style_of_life = serializers.CharField(source="lifestyle")
    hobby = serializers.CharField(source="hobbies")
    biography = serializers.CharField(source="bio")
    intro_extrovert = serializers.CharField(source="extra_intro_version")

    class Meta:
        model = UserProfile
        fields = ['photos', 'photo', 'university', 'faculty', 'course', 'languages', 'political_coordinate_economic',
                  'political_coordinate_social', 'political_view', 'cleanliness', 'style_of_life', 'schedule', 'sleep_schedule', 'bad_habits', 'mbti', 'intro_extrovert', 'hobby', 'biography', 'looking_for', 'user']

    def validate_university(self, value):
        key = int(value)
        if key not in UNIVERSITY_CHOICES.keys():
            raise serializers.ValidationError(

                "A valid option must be selected from the list")
        return UNIVERSITY_CHOICES[key]

    def validate_photo(self, value):
        if not (1 <= len(value) <= 5):
            raise serializers.ValidationError(
                "The number of photos must be between 1 and 5")

        for item in value:
            photo_validation = UserPhotoSerializer(data={'image': item})

            if not photo_validation.is_valid():
                raise serializers.ValidationError(photo_validation.errors)
        return value

    def validate_languages(self, value):
        languages = []
        for lang in value:
            if isinstance(lang, dict):
                lang = lang.get("value")

            if lang not in LANGUAGE_CHOICES.keys():
                raise serializers.ValidationError(
                    "A valid option must be selected from the list")

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

                "The coordinate is outside the valid range [-100, 100]")


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

                "The coordinate is outside the valid range [-100, 100]")

    def create(self, validated_data):
        # забирає з провалідованих даних поля на політичну коорд., яких нема в моделі і перезапише як масив
        economic_coordinate = validated_data.pop(
            "political_coordinate_economic", None)
        social_coordinate = validated_data.pop(
            "political_coordinate_social", None)

        uploaded_photos = validated_data.pop('photo', None)

        validated_data['political_view'] = [
            economic_coordinate,
            social_coordinate
        ]

        profile = super().create(validated_data)

        photos = [
            UserPhoto(user_profile=profile, image=photo)
            for photo in uploaded_photos
        ]
        UserPhoto.objects.bulk_create(photos)

        return profile

    def update(self, instance, validated_data):
        uploaded_photos = validated_data.pop('photo', None)
        profile = super().update(instance, validated_data)

        if uploaded_photos is not None:
            photos = [
                UserPhoto(user_profile=profile, image=photo)
                for photo in uploaded_photos
            ]
        UserPhoto.objects.bulk_create(photos)

        return profile

    def validate_cleanliness(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError(

                "Valid values: 1, 2, 3, 4, 5")
        return value

    def validate_style_of_life(self, value):

        if not value.strip():
            raise serializers.ValidationError("Це поле обов'язкове")
        return value

    def validate_mbti(self, value):
        key = int(value)
        if key not in MBTI_CHOICES.keys():
            raise serializers.ValidationError(
                "A valid option must be selected from the list")
        return MBTI_CHOICES[key]

    def validate_intro_extrovert(self, value):
        key = int(value)
        if key not in PERSONALITY_CHOICES.keys():
            raise serializers.ValidationError(
                "A valid option must be selected from the list")
        return PERSONALITY_CHOICES[key]
