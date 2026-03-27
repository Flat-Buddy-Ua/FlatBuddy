from rest_framework import viewsets
from blockchain.blockchain_db import blockchain


class BaseViewSet(viewsets.ModelViewSet):

    def get_model_action(self, action):
        model_name = self.queryset.model.__name__.upper()
        return f"{model_name}_{action}"

    def record_to_blockchain(self, action_type, instance):
        serializer = self.get_serializer(instance)
        action = self.get_model_action(action_type)

        blockchain.add_record({
            "action": action,
            "id": instance.pk,
            "data": serializer.data
        })

    def perform_create(self, serializer):
        instance = serializer.save()
        self.record_to_blockchain("CREATED", instance)
        return instance

    def perform_update(self, serializer):
        instance = serializer.save()
        self.record_to_blockchain("UPDATED", instance)
        return instance

    def perform_destroy(self, instance):
        self.record_to_blockchain("DELETED", instance)
        instance.delete()