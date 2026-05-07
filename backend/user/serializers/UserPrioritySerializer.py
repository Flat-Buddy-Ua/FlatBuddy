from rest_framework import serializers
from user.models import UserPriority
from user.constants.choices import PriorityField

class UserPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPriority
        fields = ['fields']

    def validate_fields(self, value):
        if len(value) > 3:
            raise serializers.ValidationError("Максимум 3 пріоритети.")
        valid = {f.value for f in PriorityField}
        for f in value:
            if f not in valid:
                raise serializers.ValidationError(f"Невідоме поле: {f}")
        return value