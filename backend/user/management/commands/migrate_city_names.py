"""
Перепис індексів міст у User.city на людиночитабельні назви.

Контекст: до інтеграції Mapbox місто обиралось зі списку — в БД летів
індекс ('1', '2', ...). Тепер фронт пише назву ('Київ', 'Львів'). У БД
лежить мікс. Скрипт нормалізує старі індекси, реальні назви не чіпає.

Мапінг береться з user.constants.choices.City (IntegerChoices) — щоб
не дублювати таблицю міст.

Використання:
  python manage.py migrate_city_names --dry-run   # показати, ЩО зміниться
  python manage.py migrate_city_names             # реально оновити
"""

import re

from django.core.management.base import BaseCommand
from django.db import transaction

from user.models import User
from user.constants.choices import City


NUMERIC_RE = re.compile(r"^\d+$")


class Command(BaseCommand):
    help = "Замінює цифрові User.city ('1', '2', ...) на назви міст."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Лише показати, що зміниться, без UPDATE.",
        )

    def handle(self, *args, **opts):
        dry = opts["dry_run"]

        id_to_label = {int(c.value): c.label for c in City}
        candidates = User.objects.exclude(city__isnull=True).exclude(city="")

        plan = []   # (user_id, email, old, new_or_None)
        unknown = []

        for u in candidates.iterator():
            raw = (u.city or "").strip()
            if not NUMERIC_RE.match(raw):
                continue
            new_label = id_to_label.get(int(raw))
            if new_label is None:
                unknown.append((u.id, u.email, raw))
                continue
            plan.append((u.id, u.email, raw, new_label))

        self.stdout.write(f"Знайдено цифрових записів: {len(plan)}")
        for uid, email, old, new in plan:
            self.stdout.write(f"  {uid:<4} {email:<40} {old!r:>5} → {new!r}")

        if unknown:
            self.stdout.write("")
            self.stdout.write(self.style.WARNING(
                f"Невідомі ID міст (не оновлюються): {len(unknown)}"
            ))
            for uid, email, raw in unknown:
                self.stdout.write(f"  {uid:<4} {email:<40} city={raw!r}")

        if dry:
            self.stdout.write("")
            self.stdout.write(self.style.NOTICE("dry-run: змін не зроблено."))
            return

        if not plan:
            self.stdout.write(self.style.SUCCESS("Нічого оновлювати."))
            return

        with transaction.atomic():
            for uid, _email, _old, new in plan:
                User.objects.filter(pk=uid).update(city=new)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"Оновлено: {len(plan)} рядків."))
