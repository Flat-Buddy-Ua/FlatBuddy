from rest_framework import serializers

class ResendLinkSerializer(serializers.Serializer):
    email = serializers.EmailField()