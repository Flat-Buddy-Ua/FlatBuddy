from django.db import models

class BlockModel(models.Model):
    index = models.IntegerField()
    timestamp = models.DateTimeField()
    data = models.JSONField()
    previous_hash = models.CharField(max_length=64)
    hash = models.CharField(max_length=64)

    class Meta:
        db_table = "blockchain_blockmodel"
        ordering = ["index"]

    def __str__(self):
        return f"Block {self.index} - {self.hash[:10]}..."