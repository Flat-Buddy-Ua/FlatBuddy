from datetime import date

import re
from rest_framework import serializers
from user.constants.choices import Country, City, Gender
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

    country = serializers.IntegerField(required=True)
    city = serializers.IntegerField(required=True)
    gender = serializers.IntegerField(required=True)
    birthdate = serializers.DateField(required=True)
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

        if not value[0].isupper():
            raise serializers.ValidationError(
                "The first letter should be capitalized")

        if not re.match(UKRAINIAN_PATTERN, value):
            raise serializers.ValidationError("Only Ukrainian characters")

        return value

    def validate_last_name(self, value):

        if not value[0].isupper():
            raise serializers.ValidationError(
                "The first letter should be capitalized")

        if not re.match(UKRAINIAN_PATTERN, value):
            raise serializers.ValidationError("Only Ukrainian characters")

        return value

    def validate_birthdate(self, value):
        # З фронта надсилається такий формат дати: 2006-10-19T21:00:00.000Z
        # Переформатування у запис: рік-місяць-день
        # value = datetime.fromisoformat(value)
        # value = value.date()

        min_date = date(1950, 1, 1)
        max_date = date.today()

        if min_date > value or max_date < value:
            raise serializers.ValidationError("Invalid date")

        return value

    def validate_phone_number(self, value):
        # З фронта надсилається такий формат: +38(0XX)-XXX-XX-XX
        # 380XXXXXXXXX - чиститься все, що не цифра
        value = re.sub(r'\D', '', value)

        if len(value) != 12:
            raise serializers.ValidationError(
                "Must be 12 digits long"
            )

        phone_code = value[2:5]
        if phone_code not in VALID_UA_PHONE_CODES:
            raise serializers.ValidationError(
                "Incorrect Ukrainian mobile carrier code")

        # нормалізований вигляд: +380XXXXXXXXX
        value = f"+{value}"

        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "This phone number is already registered")

        return value

    def validate(self, data):
        if data['password'] != data['repeat_password']:
            raise serializers.ValidationError("The passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop("repeat_password")
        return User.objects.create_user(**validated_data)
