import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_userprofile_parsed_sleep_hour_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active'),
        ),
        migrations.CreateModel(
            name='UserPriority',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fields', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('cleanliness', 'Охайність'), ('hobbies', 'Хобі'), ('smoking', 'Ставлення до паління'), ('partying', 'Ставлення до вечірок'), ('schedule', 'Графік дня'), ('sleep_schedule', 'Режим сну'), ('political_view', 'Політичні погляди'), ('extra_intro_version', 'Інтро/екстраверсія'), ('vibe', 'Загальний вайб')], max_length=30), blank=True, default=list, size=3)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='priority', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_priority',
            },
        ),
        migrations.CreateModel(
            name='MatchResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_score', models.FloatField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Очікує обрахунку'), ('done', 'Розраховано'), ('skipped', 'Пропущено (hard filter / неповна анкета)'), ('error', 'Помилка')], default='pending', max_length=10)),
                ('hard_filter_passed', models.BooleanField(default=False)),
                ('skip_reason', models.CharField(blank=True, max_length=50)),
                ('score_vibe', models.FloatField(blank=True, null=True)),
                ('score_hobbies', models.FloatField(blank=True, null=True)),
                ('score_cleanliness', models.FloatField(blank=True, null=True)),
                ('score_smoking', models.FloatField(blank=True, null=True)),
                ('score_partying', models.FloatField(blank=True, null=True)),
                ('score_political', models.FloatField(blank=True, null=True)),
                ('score_personality', models.FloatField(blank=True, null=True)),
                ('score_schedule', models.FloatField(blank=True, null=True)),
                ('is_stale', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user_1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_1', to=settings.AUTH_USER_MODEL)),
                ('user_2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_2', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'match_result',
                'indexes': [models.Index(fields=['user_1', 'total_score'], name='match_resul_user_1__39bced_idx'), models.Index(fields=['user_2', 'total_score'], name='match_resul_user_2__d2ca4c_idx'), models.Index(fields=['is_stale'], name='match_resul_is_stal_df232d_idx')],
                'unique_together': {('user_1', 'user_2')},
            },
        ),
    ]
