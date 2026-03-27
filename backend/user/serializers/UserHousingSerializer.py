from rest_framework import serializers

# from django.utils.translation import gettext_lazy as _

from user.models import UserHousing
from user.constants.choices import (
    ROOM_SHARING_CHOICES,
    PREFERRED_GENDER_CHOICES,

    HOUSING_STATUS_CHOICES
)


class UserHousingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserHousing
        fields = ['room_sharing_preference', 'preferred_gender', 'housing_status', 'budget',
                  'preferred_districts', 'planned_duration', 'move_in_date', 'has_pet', 'pet_description', 'user']

#! Переглянути і можливо переробити
    # def _get_city_id_from_city_name(self, city_name):
    #     # Конверт назву міста в ID з CITY_CHOICES
    #     if not city_name:
    #         return None

    #     city_name_str = str(city_name).strip()
    #     city_name_lower = city_name_str.lower()

    #     # Точне співпадіння
    #     for city_id, name in CITY_CHOICES.items():
    #         if name.lower() == city_name_lower:
    #             return city_id

    #     # Часткове співпадіння
    #     for city_id, name in CITY_CHOICES.items():
    #         if city_name_lower in name.lower() or name.lower() in city_name_lower:
    #             return city_id

    #     # Для міст з апострофами
    #     city_name_no_apostrophe = city_name_lower.replace("'", "")
    #     for city_id, name in CITY_CHOICES.items():
    #         if name.lower().replace("'", "") == city_name_no_apostrophe:
    #             return city_id

    #     return None

    def validate_room_sharing_preference(self, value):
        key = int(value)
        if key not in ROOM_SHARING_CHOICES:
            raise serializers.ValidationError(
                'A valid option must be selected from the list')
        return ROOM_SHARING_CHOICES[key]

    def validate_preferred_gender(self, value):
        key = int(value)
        if key not in PREFERRED_GENDER_CHOICES:
            raise serializers.ValidationError(
                'A valid option must be selected from the list')
        return PREFERRED_GENDER_CHOICES[key]

    def validate_housing_status(self, value):
        key = int(value)
        if key not in HOUSING_STATUS_CHOICES:
            raise serializers.ValidationError(
                'A valid option must be selected from the list')
        return HOUSING_STATUS_CHOICES[key]

    def validate_budget(self, value):
        budget = int(value)
        if budget <= 0 or budget > 1000000:
            raise serializers.ValidationError("Invalid budget")
        return budget

#! Переглянути і можливо переробити
    # def validate_preferred_districts(self, value):
    #     if not value:
    #         raise serializers.ValidationError(_('Це поле обов\'язкове'))

    #     if not isinstance(value, list):
    #         raise serializers.ValidationError(
    #             _('A valid option must be selected from the list')
    #         )

    #     if len(value) == 0:
    #         raise serializers.ValidationError(
    #             _('Оберіть принаймні один район')
    #         )

    #     # Отримати місто користувача для перевірки районів
    #     user = self.context['request'].user
    #     city_name = user.city

    #     # Конвертуємо назву міста в ID
    #     city_id = self._get_city_id_from_city_name(city_name)

    #     if not city_id:
    #         raise serializers.ValidationError(
    #             _('Місто "{}" не знайдено в системі. Оберіть місто зі списку.').format(
    #                 city_name)
    #         )

    #     # Отримати райони для цього міста
    #     city_districts = DISTRICTS_BY_CITY.get(city_id, {})

    #     if not city_districts:
    #         raise serializers.ValidationError(
    #             'Для вашого міста ще не додано райони')

    #     # Перевірити кожен район
    #     valid_district_ids = list(city_districts.keys())
    #     invalid_districts = []

    #     for district_id in value:
    #         if not isinstance(district_id, int):
    #             raise serializers.ValidationError(
    #                 'A valid option must be selected from the list')

    #         if district_id not in valid_district_ids:
    #             invalid_districts.append(str(district_id))

    #     if invalid_districts:
    #         raise serializers.ValidationError(
    #             _('Райони з ID {} недоступні для міста {}').format(
    #                 ', '.join(invalid_districts),
    #                 CITY_CHOICES.get(city_id, city_name)
    #             )
    #         )

    #     return value

    # def validate_planned_duration(self, value):
    #     value = value.strip()

    #     if len(value) <= 2:
    #         raise serializers.ValidationError(
    #             'Має містити більше ніж 2 символи')

        # if len(value) >= 50:
        #     raise serializers.ValidationError(
        #         'Має містити менше ніж 50 символів')

        # return value

    # def validate_move_in_date(self, value):
    #     value = value.strip()
    #     if len(value) <= 2:
    #         raise serializers.ValidationError(
    #             'Має містити більше ніж 2 символи')

        # if len(value) >= 50:
        #     raise serializers.ValidationError(
        #         'Має містити менше ніж 50 символів')

        # return value

    # def validate(self, data):
    #     has_pet = data.get('has_pet')
    #     pet_description = data.get('pet_description').strip()

    #     if has_pet:
    #         if len(pet_description) <= 2:
    #             raise serializers.ValidationError({
    #                 'pet_description': "Має містити більше ніж 2 символи."
    #             })

    #         if len(pet_description) >= 100:
    #             raise serializers.ValidationError({
    #                 'pet_description': "Має містити менше ніж 100 символів."
    #             })

    #         data['pet_description'] = pet_description
    #     else:
    #         data['pet_description'] = None

    #     return data

    # def create(self, validated_data):
    #     validated_data['user'] = self.context['request'].user
    #     return super().create(validated_data)
