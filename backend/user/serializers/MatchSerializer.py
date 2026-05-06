from datetime import date

from rest_framework import serializers

from user.models import MatchResult, User, UserProfile, UserHousing
from user.serializers.UserPhotoSerializer import UserPhotoSerializer
from user.constants.choices import Language, Hobby, District

_LANGUAGE_LABELS  = dict(Language.choices)
_HOBBY_LABELS     = dict(Hobby.choices)
_DISTRICT_LABELS  = dict(District.choices)


class _ProfileSerializer(serializers.ModelSerializer):
    photos = UserPhotoSerializer(many=True, read_only=True)

    status             = serializers.CharField(source='get_status_display',           read_only=True)
    orbit              = serializers.CharField(source='get_orbit_display',            read_only=True)
    smoking            = serializers.CharField(source='get_smoking_display',          read_only=True)
    partying           = serializers.CharField(source='get_partying_display',         read_only=True)
    extra_intro_version = serializers.CharField(source='get_extra_intro_version_display', read_only=True)
    languages = serializers.SerializerMethodField()
    hobbies   = serializers.SerializerMethodField()

    def get_languages(self, obj):
        return [_LANGUAGE_LABELS.get(v, v) for v in (obj.languages or [])]

    def get_hobbies(self, obj):
        return [_HOBBY_LABELS.get(v, v) for v in (obj.hobbies or [])]

    class Meta:
        model = UserProfile
        fields = [
            'photos',
            'status',
            'orbit',
            'languages',
            'political_coordinate_economic',
            'political_coordinate_social',
            'cleanliness',
            'my_vibe',
            'buddy_vibe',
            'schedule',
            'sleep_schedule',
            'smoking',
            'extra_intro_version',
            'hobbies',
            'custom_hobbies',
            'partying',
        ]


class _HousingSerializer(serializers.ModelSerializer):
    room_sharing_preference = serializers.CharField(source='get_room_sharing_preference_display', read_only=True)
    preferred_gender        = serializers.CharField(source='get_preferred_gender_display',        read_only=True)
    housing_status          = serializers.CharField(source='get_housing_status_display',          read_only=True)
    destination             = serializers.CharField(source='get_destination_display',             read_only=True)
    planned_duration        = serializers.CharField(source='get_planned_duration_display',        read_only=True)
    preferred_districts = serializers.SerializerMethodField()

    def get_preferred_districts(self, obj):
        return [_DISTRICT_LABELS.get(v, v) for v in (obj.preferred_districts or [])]

    class Meta:
        model = UserHousing
        fields = [
            'room_sharing_preference',
            'preferred_gender',
            'housing_status',
            'budget_min',
            'budget_max',
            'destination',
            'preferred_districts',
            'planned_duration',
            'move_in_date',
            'has_pet',
            'pet_description',
        ]


class _MatchedUserSerializer(serializers.ModelSerializer):
    age     = serializers.SerializerMethodField()
    profile = _ProfileSerializer(read_only=True)
    housing = _HousingSerializer(read_only=True)

    class Meta:
        model  = User
        fields = ['id', 'first_name', 'last_name', 'age', 'profile', 'housing']

    def get_age(self, obj: User):
        if not obj.birthdate:
            return None
        today = date.today()
        return today.year - obj.birthdate.year - (
            (today.month, today.day) < (obj.birthdate.month, obj.birthdate.day)
        )


class MatchResultSerializer(serializers.ModelSerializer):
    matched_user = serializers.SerializerMethodField()

    class Meta:
        model  = MatchResult
        fields = [
            'id',
            'matched_user',
            'total_score',
            'score_vibe',
            'score_hobbies',
            'score_cleanliness',
            'score_smoking',
            'score_partying',
            'score_political',
            'score_personality',
            'score_schedule',
        ]

    def get_matched_user(self, obj: MatchResult):
        me_id = self.context['request'].user.id
        other = obj.user_2 if obj.user_1_id == me_id else obj.user_1
        return _MatchedUserSerializer(other, context=self.context).data