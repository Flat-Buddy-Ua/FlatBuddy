from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import BlockModel
from .blockchain_db import blockchain

class BlockchainViewSet(viewsets.ViewSet):
    def list(self, request):
        chain_data = [{
            "index": b.index,
            "timestamp": b.timestamp,
            "data": b.data,
            "previous_hash": b.previous_hash,
            "hash": b.hash
        } for b in BlockModel.objects.all()]
        return Response(chain_data)


    def retrieve(self, request, pk=None):
        try:
            block = BlockModel.objects.get(index=int(pk))
            return Response({
                "index": block.index,
                "timestamp": block.timestamp,
                "data": block.data,
                "previous_hash": block.previous_hash,
                "hash": block.hash
            })
        except BlockModel.DoesNotExist:
            return Response({"error": "Блок не знайдено"}, status=404)


    def create(self, request):
        data = request.data.get("data")
        if not isinstance(data, dict):
            return Response({"error": "data має бути dict"}, status=400)
        block = blockchain.add_record(data)
        return Response({
            "index": block.index,
            "timestamp": block.timestamp,
            "data": block.data,
            "previous_hash": block.previous_hash,
            "hash": block.hash
        }, status=201)