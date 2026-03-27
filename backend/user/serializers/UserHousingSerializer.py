from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from user.models import UserHousing
from user.constants.choices import (
    ROOM_SHARING_CHOICES,
    PREFERRED_GENDER_CHOICES,
    HOUSING_STATUS_CHOICES,
    HAS_PET_CHOICES,
    DISTRICTS_BY_CITY,
    CITY_CHOICES,
)


class UserHousingSerializer(serializers.ModelSerializer):
    room_sharing_preference = serializers.CharField(required=True, write_only=True)
    preferred_gender = serializers.CharField(required=True, write_only=True)
    housing_status = serializers.CharField(required=True, write_only=True)
    budget = serializers.CharField(required=True, write_only=True)
    preferred_districts = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        allow_empty=False,
        write_only=True
    )
    planned_duration = serializers.CharField(required=True, write_only=True)
    move_in_date = serializers.CharField(required=True, write_only=True)
    has_pet = serializers.CharField(required=True, write_only=True)
    pet_description = serializers.CharField(
        required=False, 
        allow_blank=True, 
        allow_null=True, 
        write_only=True
    )
    
    class Meta:
        model = UserHousing
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at', 'housing_id')
    
    def _get_city_id_from_city_name(self, city_name):
        # Конверт назву міста в ID з CITY_CHOICES
        if not city_name:
            return None
        
        city_name_str = str(city_name).strip()
        city_name_lower = city_name_str.lower()
        
        # Точне співпадіння
        for city_id, name in CITY_CHOICES.items():
            if name.lower() == city_name_lower:
                return city_id
        
        # Часткове співпадіння
        for city_id, name in CITY_CHOICES.items():
            if city_name_lower in name.lower() or name.lower() in city_name_lower:
                return city_id
        
        # Для міст з апострофами
        city_name_no_apostrophe = city_name_lower.replace("'", "")
        for city_id, name in CITY_CHOICES.items():
            if name.lower().replace("'", "") == city_name_no_apostrophe:
                return city_id
        
        return None
    
    def validate_room_sharing_preference(self, value):
        try:
            key = int(value)
            if key in ROOM_SHARING_CHOICES:
                return ROOM_SHARING_CHOICES[key]
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
        except (ValueError, TypeError):
            valid_values = list(ROOM_SHARING_CHOICES.values())
            if value in valid_values:
                return value
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
    
    def validate_preferred_gender(self, value):
        try:
            key = int(value)
            if key in PREFERRED_GENDER_CHOICES:
                return PREFERRED_GENDER_CHOICES[key]
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
        except (ValueError, TypeError):
            valid_values = list(PREFERRED_GENDER_CHOICES.values())
            if value in valid_values:
                return value
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
    
    def validate_housing_status(self, value):
        try:
            key = int(value)
            if key in HOUSING_STATUS_CHOICES:
                return HOUSING_STATUS_CHOICES[key]
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
        except (ValueError, TypeError):
            valid_values = list(HOUSING_STATUS_CHOICES.values())
            if value in valid_values:
                return value
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
    
    def validate_budget(self, value):
        if not value:
            raise serializers.ValidationError(_('Це поле обов\'язкове'))
        
        value_str = str(value).strip()
        
        if len(value_str) <= 2:
            raise serializers.ValidationError(
                _('Має містити більше ніж 2 символи')
            )
        
        if len(value_str) > 50:
            raise serializers.ValidationError(
                _('Має містити менше ніж 50 символів')
            )
        
        try:
            clean_value = value_str.replace(' ', '').replace(',', '')
            budget_int = int(clean_value)
            
            if budget_int < 0:
                raise serializers.ValidationError(
                    _('Бюджет не може бути від\'ємним')
                )
            
            if budget_int > 1000000:
                raise serializers.ValidationError(
                    _('Бюджет занадто великий')
                )
                
            return budget_int
        except ValueError:
            raise serializers.ValidationError(
                _('Введіть коректне число')
            )
    
    def validate_preferred_districts(self, value):
        if not value:
            raise serializers.ValidationError(_('Це поле обов\'язкове'))
        
        if not isinstance(value, list):
            raise serializers.ValidationError(
                _('Оберіть дійсний варіант зі списку')
            )
        
        if len(value) == 0:
            raise serializers.ValidationError(
                _('Оберіть принаймні один район')
            )
        
        # Отримати місто користувача для перевірки районів
        user = self.context['request'].user
        city_name = user.city
        
        # Конвертуємо назву міста в ID
        city_id = self._get_city_id_from_city_name(city_name)
        
        if not city_id:
            raise serializers.ValidationError(
                _('Місто "{}" не знайдено в системі. Оберіть місто зі списку.').format(city_name)
            )
        
        # Отримати райони для цього міста
        city_districts = DISTRICTS_BY_CITY.get(city_id, {})
        
        if not city_districts:
            raise serializers.ValidationError(
                _('Для вашого міста ще не додано райони')
            )
        
        # Перевірити кожен район
        valid_district_ids = list(city_districts.keys())
        invalid_districts = []
        
        for district_id in value:
            if not isinstance(district_id, int):
                raise serializers.ValidationError(
                    _('Оберіть дійсний варіант зі списку')
                )
            if district_id not in valid_district_ids:
                invalid_districts.append(str(district_id))
        
        if invalid_districts:
            raise serializers.ValidationError(
                _('Райони з ID {} недоступні для міста {}').format(
                    ', '.join(invalid_districts), 
                    CITY_CHOICES.get(city_id, city_name)
                )
            )
        
        return value
    
    def validate_planned_duration(self, value):
        if not value:
            raise serializers.ValidationError(_('Це поле обов\'язкове'))
        
        value_str = str(value).strip()
        
        if len(value_str) <= 2:
            raise serializers.ValidationError(
                _('Має містити більше ніж 2 символи')
            )
        
        if len(value_str) > 50:
            raise serializers.ValidationError(
                _('Має містити менше ніж 50 символів')
            )
        
        return value_str
    
    def validate_move_in_date(self, value):
        if not value:
            raise serializers.ValidationError(_('Це поле обов\'язкове'))
        
        value_str = str(value).strip()
        
        if len(value_str) <= 2:
            raise serializers.ValidationError(
                _('Має містити більше ніж 2 символи')
            )
        
        if len(value_str) > 100:
            raise serializers.ValidationError(
                _('Має містити менше ніж 100 символів')
            )
        
        return value_str
    
    def validate_has_pet(self, value):
        try:
            key = int(value)
            if key in HAS_PET_CHOICES:
                return HAS_PET_CHOICES[key]
        except (ValueError, TypeError):
            pass
        
        if isinstance(value, str):
            value_lower = value.lower().strip()
            if value_lower in ['1', 'true', 'так', 'yes', 't']:
                return 'Так'
            elif value_lower in ['2', 'false', 'ні', 'no', 'f']:
                return 'Ні'
        
        raise serializers.ValidationError(
            _('Оберіть дійсний варіант (Так/Ні)')
        )
    
    def validate(self, data):
        has_pet = data.get('has_pet')
        pet_description = data.get('pet_description', '')
        
        if has_pet == 'Так':
            if not pet_description or pet_description.strip() == '':
                raise serializers.ValidationError({
                    'pet_description': _('Це поле обов\'язкове, якщо є домашні улюбленці')
                })
            
            pet_description_str = str(pet_description).strip()
            
            if len(pet_description_str) <= 2:
                raise serializers.ValidationError({
                    'pet_description': _('Має містити більше ніж 2 символи')
                })
            
            if len(pet_description_str) > 100:
                raise serializers.ValidationError({
                    'pet_description': _('Має містити менше ніж 100 символів')
                })
            
            data['pet_description'] = pet_description_str
        else:
            data['pet_description'] = None
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if 'budget' in representation and representation['budget'] is not None:
            representation['budget'] = str(representation['budget'])
        
        return representation