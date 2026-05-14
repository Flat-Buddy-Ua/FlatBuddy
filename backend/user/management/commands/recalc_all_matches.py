"""
Синхронно перераховує MatchResult для всіх юзерів з повними profile+housing.
Обходить Celery — корисно, якщо воркер не крутиться або потрібно одноразово
прогнати після зміни логіки/схеми.

Використання:
  python manage.py recalc_all_matches
  python manage.py recalc_all_matches --only 14,54,67   # тільки для цих юзерів
"""

from django.core.management.base import BaseCommand

from user.models import User, MatchResult
from user.matching.tasks import recalculate_matches_for_user


class Command(BaseCommand):
    help = "Синхронний перерахунок MatchResult для всіх або заданих юзерів."

    def add_arguments(self, parser):
        parser.add_argument(
            "--only",
            default=None,
            help="Через кому ID юзерів, для яких прогнати. Без прапорця — усі.",
        )

    def handle(self, *args, **opts):
        qs = User.objects.filter(
            housing__isnull=False,
            profile__isnull=False,
            housing__destination__isnull=False,
        )

        if opts["only"]:
            ids = [int(x) for x in opts["only"].split(",") if x.strip()]
            qs = qs.filter(id__in=ids)

        total = qs.count()
        self.stdout.write(f"users to recalc: {total}")

        for i, u in enumerate(qs.iterator(), 1):
            self.stdout.write(f"  [{i}/{total}] user {u.id}…", ending=" ")
            try:
                recalculate_matches_for_user(u.id)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"FAIL: {e!r}"))
                continue
            self.stdout.write(self.style.SUCCESS("ok"))

        done = MatchResult.objects.filter(status=MatchResult.Status.DONE).count()
        skipped = MatchResult.objects.filter(status=MatchResult.Status.SKIPPED).count()
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово. MatchResult: DONE={done} SKIPPED={skipped}"
        ))
