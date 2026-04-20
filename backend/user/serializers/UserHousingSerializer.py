from rest_framework import serializers
from user.models import UserHousing
from user.constants.choices import CITY_DISTRICTS_MAPPING
from datetime import date

class UserHousingSerializer(serializers.ModelSerializer):

    budget_min = serializers.IntegerField(min_value=500)
    budget_max = serializers.IntegerField(max_value=100000)

    class Meta:
        model = UserHousing
        fields = ['room_sharing_preference', 'preferred_gender', 'housing_status', 'budget_min', 'budget_max',
                  'destination', 'preferred_districts', 'planned_duration', 'move_in_date', 'has_pet', 'pet_description', 'user']
        read_only_fields = ['user']

    def validate(self, data):
        budget_min = data.get('budget_min', getattr(self.instance, 'budget_min', None))
        budget_max = data.get('budget_max', getattr(self.instance, 'budget_max', None))
        
        if budget_min is not None and budget_max is not None:
            if budget_min > budget_max:
                raise serializers.ValidationError({"budget_min": "Мінімальний бюджет не може бути більшим за максимальний."})
        
        if data.get('move_in_date') and data.get('move_in_date') < date.today():
            raise serializers.ValidationError({"move_in_date": "Дата заселення не може бути в минулому."})
    
        destination = data.get('destination', getattr(self.instance, 'destination', None))
        preferred_districts = data.get('preferred_districts', getattr(self.instance, 'preferred_districts', []))
        
        if destination and preferred_districts:
            if len(preferred_districts) > 10:
                raise serializers.ValidationError({"preferred_districts": "Максимальна кількість районів - 10."})
            
            allowed_districts = CITY_DISTRICTS_MAPPING.get(destination, [])
            invalid_districts = [district for district in preferred_districts if district not in allowed_districts]
            
            if invalid_districts:
                raise serializers.ValidationError({"preferred_districts": f"Невірні райони для вибраного міста: {invalid_districts}."})
        
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
