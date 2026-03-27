import hashlib
import json
from datetime import datetime
from .models import BlockModel

class Blockchain:
    def add_record(self, data: dict):
        last_block = self.get_last_block()
        index = 0 if last_block is None else last_block.index + 1
        previous_hash = "0" if last_block is None else last_block.hash
        timestamp = datetime.utcnow()
        block_hash = self.calculate_hash(index, timestamp, data, previous_hash)

        block = BlockModel.objects.create(
            index=index,
            timestamp=timestamp,
            data=data,
            previous_hash=previous_hash,
            hash=block_hash
        )
        return block

    def calculate_hash(self, index, timestamp, data, previous_hash):
        block_string = json.dumps({
            "index": index,
            "timestamp": timestamp.isoformat(),
            "data": data,
            "previous_hash": previous_hash
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def get_last_block(self):
        return BlockModel.objects.order_by('-index').first()

    def create_genesis_block(self):
        if BlockModel.objects.count() == 0:
            self.add_record({"message": "Genesis Block"})

blockchain = Blockchain()

def initialize_blockchain():
    blockchain.create_genesis_block()