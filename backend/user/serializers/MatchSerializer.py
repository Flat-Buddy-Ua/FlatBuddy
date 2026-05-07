from rest_framework import serializers
from user.models import MatchResult

class MatchResultSerializer(serializers.ModelSerializer):
    matched_user = serializers.SerializerMethodField()

    class Meta:
        model = MatchResult
        fields = [
            'id', 'matched_user', 'total_score', 'status',
            'score_vibe', 'score_schedule', 'score_cleanliness',
            'score_hobbies', 'score_smoking', 'score_partying',
            'score_political', 'score_personality',
            'created_at',
        ]

    def get_matched_user(self, obj):
        me = self.context['request'].user
        other = obj.user_2 if obj.user_1_id == me.id else obj.user_1
        return {'id': other.id, 'first_name': other.first_name, 'last_name': other.last_name}