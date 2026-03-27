from django.apps import AppConfig
import sys

class BlockchainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blockchain'

    def ready(self):
        if 'makemigrations' in sys.argv or 'migrate' in sys.argv:
            return
        from .blockchain_db import initialize_blockchain
        initialize_blockchain()