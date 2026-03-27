from datetime import date, datetime
import re
from rest_framework import serializers
from user.constants.choices import CITY_CHOICES, COUNTRY_CHOICES, VALID_GENDERS
from user.models import User

UKRAINIAN_PATTERN = r"^[А-ЩЬЮЯҐЄІЇ][а-щьюяґєії'\-]*$"

VALID_UA_PHONE_CODES = [
    # Київстар
    '067', '068', '096', '097', '098',
    # Vodafone
    '050', '066', '095', '099',
    # lifecell
    '063', '073', '093',
    # Інтертелеком
    '089', '094',
    # ТриМоб
    '091',
    # People.net
    '092',
    # Фінтелеком
    '039'
]


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    repeat_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "first_name", "last_name", "country", "city",
            "gender", "birthdate", "phone_number", "email",
            "password", "repeat_password",
        ]

    def validate_first_name(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 50:
            raise serializers.ValidationError(
                "Має містити менше ніж 50 символів")

        if not value[0].isupper():
            raise serializers.ValidationError(
                "Перша літера має бути великою")

        if not re.match(UKRAINIAN_PATTERN, value):
            raise serializers.ValidationError("Тільки українські літери")

        return value

    def validate_last_name(self, value):
        if len(value) <= 2:
            raise serializers.ValidationError(
                "Має містити більше ніж 2 символи")

        if len(value) >= 50:
            raise serializers.ValidationError(
                "Має містити менше ніж 50 символів")

        if not value[0].isupper():
            raise serializers.ValidationError(
                "Перша літера має бути великою")

        if not re.match(UKRAINIAN_PATTERN, value):
            raise serializers.ValidationError("Тільки українські літери")

        return value

    def validate_country(self, value):
        key = int(value)
        if key not in COUNTRY_CHOICES.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")

        return COUNTRY_CHOICES[key]

    def validate_city(self, value):
        key = int(value)
        if key not in CITY_CHOICES.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")

        return CITY_CHOICES[key]

    def validate_gender(self, value):
        key = int(value)
        if key not in VALID_GENDERS.keys():
            raise serializers.ValidationError(
                "Має бути обрано дійсний варіант зі списку")

        return VALID_GENDERS[key]

    def validate_birthdate(self, value):
        # З фронта надсилається такий формат дати: 2006-10-19T21:00:00.000Z
        # Переформатування у запис: рік-місяць-день
        value = datetime.fromisoformat(value)
        value = value.date()

        min_date = date(1950, 1, 1)
        max_date = date.today()

        if min_date > value or max_date < value:
            raise serializers.ValidationError("Некоректна дата")

        return value

    def validate_phone_number(self, value):
        # З фронта надсилається такий формат: +38(0XX)-XXX-XX-XX
        # 380XXXXXXXXX - чиститься все, що не цифра
        value = re.sub(r'\D', '', value)

        if len(value) != 12:
            raise serializers.ValidationError(
                "Має містити 12 цифр"
            )

        phone_code = value[2:5]
        if phone_code not in VALID_UA_PHONE_CODES:
            raise serializers.ValidationError(
                "Невірний код мобільного оператора України")

        # нормалізований вигляд: +380XXXXXXXXX
        value = f"+{value}"
        # окрема перевірка на унікальність, бо в модельці unique для цього поля не працює
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "Цей номер телефону вже зареєстрований")

        return value

    def validate_email(self, value):
        if len(value) >= 50:
            raise serializers.ValidationError(
                "Має містити не більше ніж 50 символів")

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        repeat_password = validated_data.pop("repeat_password")
        user = User.create_user_with_password(
            validated_data, password, repeat_password)
        user.save()
        return user