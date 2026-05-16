from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_fix_user_int_columns'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchresult',
            name='score_budget',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
