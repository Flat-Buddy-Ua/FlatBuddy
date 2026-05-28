from datetime import date

from rest_framework import serializers

from user.models import MatchResult, User, UserProfile, UserHousing
from user.serializers.UserPhotoSerializer import UserPhotoSerializer


class _ProfileSerializer(serializers.ModelSerializer):
    photos = UserPhotoSerializer(many=True, read_only=True)

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
    age    = serializers.SerializerMethodField()
    profile = _ProfileSerializer(read_only=True, allow_null=True)
    housing = _HousingSerializer(read_only=True, allow_null=True)

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
            'score_budget',
        ]

    def get_matched_user(self, obj: MatchResult):
        me_id = self.context['request'].user.id
        other = obj.user_2 if obj.user_1_id == me_id else obj.user_1
        return _MatchedUserSerializer(other, context=self.context).data