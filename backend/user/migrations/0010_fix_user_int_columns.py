"""
Виправляє розсинхрон схеми для User.gender та User.country.

Модель оголошує обидва поля як IntegerField з 0001_initial, але через те,
що 0001_initial.py редагували in-place (CharField → IntegerField), на
довгоживучих БД (зокрема prod) колонки лишилися character varying.

Симптом: Django повертає рядок ('2' замість 2), і будь-яке порівняння з
enum-значенням (Gender.FEMALE == 2) валиться. Найпомітніший наслідок —
hard-filter `genders_compatible` у user.matching.hard_filters
відкидав усі пари «жінка ↔ жінка».

Міграція ідемпотентна: ALTER виконується тільки якщо колонка зараз
ще рядкова. На свіжих БД нічого не зробить.
"""

from django.db import migrations


def _alter(column: str) -> str:
    return f"""
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'user'
          AND column_name = '{column}'
          AND data_type IN ('character varying', 'text', 'character')
    ) THEN
        ALTER TABLE "user"
            ALTER COLUMN {column} TYPE integer USING {column}::integer;
    END IF;
END$$;
"""


SQL_FORWARD = _alter("gender") + _alter("country")

SQL_REVERSE = """
ALTER TABLE "user" ALTER COLUMN gender  TYPE varchar(10) USING gender::text;
ALTER TABLE "user" ALTER COLUMN country TYPE varchar(10) USING country::text;
"""


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_userlike_usermatch'),
    ]

    operations = [
        migrations.RunSQL(SQL_FORWARD, reverse_sql=SQL_REVERSE),
    ]
