from rest_framework import serializers
from .UserPhotoSerializer import UserPhotoSerializer
from user.models import UserPhoto, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):

    photo = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True
    )
    
    photos = UserPhotoSerializer(many=True)

    political_coordinate_economic = serializers.IntegerField(min_value=-100, max_value=100)
    political_coordinate_social = serializers.IntegerField(min_value=-100, max_value=100)

    political_coordinate_economic_label = serializers.SerializerMethodField()
    political_coordinate_social_label = serializers.SerializerMethodField()

    cleanliness = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = UserProfile
        fields = ['photos', 'photo', 'status', 'orbit', 'languages',
                  'political_coordinate_economic', "political_coordinate_economic_label",
                  'political_coordinate_social', "political_coordinate_social_label",
                  'cleanliness', 'my_vibe', 'buddy_vibe', 'schedule',
                  'sleep_schedule', 'smoking', 'partying', 'extra_intro_version',
                  'hobbies', 'user']
        read_only_fields = ['photos', 'user', 'political_coordinate_economic_label', 'political_coordinate_social_label']

    def validate_photo(self, value):
        if not (1 <= len(value) <= 5):
            raise serializers.ValidationError(
                "The number of photos must be between 1 and 5")

        for item in value:
            photo_validation = UserPhotoSerializer(data={'image': item})

            if not photo_validation.is_valid():
                raise serializers.ValidationError(photo_validation.errors)
        return value

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

    def create(self, validated_data):
        uploaded_photos = validated_data.pop('photo', [])

        profile = super().create(validated_data)

        for photo in uploaded_photos:
            UserPhoto.objects.create(user_profile=profile, image=photo)

        return profile

    def update(self, instance, validated_data):
        uploaded_photos = validated_data.pop('photo', None)
        
        profile = super().update(instance, validated_data)

        if uploaded_photos is not None:
            instance.photos.all().delete()
            
            for photo in uploaded_photos:
                UserPhoto.objects.create(user_profile=profile, image=photo)

        return profile
