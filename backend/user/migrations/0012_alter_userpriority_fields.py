import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_matchresult_score_budget'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpriority',
            name='fields',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        ('cleanliness', 'Охайність'),
                        ('hobbies', 'Хобі'),
                        ('smoking', 'Ставлення до паління'),
                        ('partying', 'Ставлення до вечірок'),
                        ('schedule', 'Графік дня'),
                        ('sleep_schedule', 'Режим сну'),
                        ('political_view', 'Політичні погляди'),
                        ('extra_intro_version', 'Інтро/екстраверсія'),
                        ('vibe', 'Загальний вайб'),
                        ('budget', 'Бюджет'),
                    ],
                    max_length=30,
                ),
                blank=True,
                default=list,
                size=3,
            ),
        ),
    ]
