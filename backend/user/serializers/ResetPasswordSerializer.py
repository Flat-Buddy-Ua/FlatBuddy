from rest_framework import serializers
from user.models import User

class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    repeat_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "password", "repeat_password"
        ]

    def validate(self, data):
        password = data.get('password')
        repeat_password = data.get('repeat_password')
        if password or repeat_password:
            if password != repeat_password:
                raise serializers.ValidationError("The passwords don't match")
        return data
    
    def update(self, instance, validated_data):
        password = validated_data.get("password")
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance