from rest_framework import serializers
from user.models import UserLike, UserMatch, User

class ShortUserSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    def get_photo(self, obj):
        photo = obj.profile.photos.first() if hasattr(obj, 'profile') else None
        if photo and photo.image:
            request = self.context.get('request')
            return request.build_absolute_uri(photo.image.url) if request else photo.image.url
        return None

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'photo']

class UserLikeSerializer(serializers.ModelSerializer):
    from_user = ShortUserSerializer(read_only=True)
    to_user   = ShortUserSerializer(read_only=True)

    class Meta:
        model  = UserLike
        fields = ['id', 'from_user', 'to_user', 'created_at']

class UserMatchSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    def get_other_user(self, obj):
        me = self.context['request'].user
        other = obj.user_2 if obj.user_1_id == me.id else obj.user_1
        return ShortUserSerializer(other, context=self.context).data

    class Meta:
        model  = UserMatch
        fields = ['id', 'other_user', 'compatibility_score', 'matched_at']

class LikeActionSerializer(serializers.Serializer):
    to_user_id = serializers.IntegerField()

    def validate_to_user_id(self, value):
        request = self.context['request']
        if value == request.user.id:
            raise serializers.ValidationError("Не можна лайкнути себе.")
        if not User.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Юзер не знайдений.")
        return value