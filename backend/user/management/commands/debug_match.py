"""
Запускає calculate_match синхронно для пари юзерів і друкує результат.
Корисно, коли матчі не з'являються в API і треба зрозуміти причину
без Celery/Redis.

Використання:
  python manage.py debug_match 14 54
  python manage.py debug_match 14 54 67           # перебере всі пари
  python manage.py debug_match 14 54 --save       # запише MatchResult у БД
  python manage.py debug_match 14 54 --embeddings # порахує embeddings, якщо їх нема
"""

import json
from itertools import combinations

from django.core.management.base import BaseCommand, CommandError

from user.models import User, MatchResult
from user.matching.engine import calculate_match
from user.matching.completeness import is_profile_complete
from user.matching.tasks import _ordered_pair, _save_result


class Command(BaseCommand):
    help = "Синхронний прогін calculate_match для заданих ID."

    def add_arguments(self, parser):
        parser.add_argument(
            "user_ids",
            nargs="+",
            type=int,
            help="ID юзерів (мінімум 2). Для 3+ — всі пари.",
        )
        parser.add_argument(
            "--save",
            action="store_true",
            help="Записати результат у MatchResult (як це робить Celery-таска).",
        )
        parser.add_argument(
            "--embeddings",
            action="store_true",
            help="Порахувати і закешувати embeddings, якщо їх ще нема.",
        )

    def handle(self, *args, **opts):
        ids = opts["user_ids"]
        if len(ids) < 2:
            raise CommandError("Потрібно мінімум 2 ID.")

        users = {}
        for uid in set(ids):
            try:
                users[uid] = User.objects.select_related(
                    "profile", "housing", "priority"
                ).get(id=uid)
            except User.DoesNotExist:
                raise CommandError(f"User id={uid} не знайдено.")

        if opts["embeddings"]:
            self._ensure_embeddings(users.values())

        self._print_preflight(users)

        self.stdout.write(self.style.MIGRATE_HEADING("\n=== ПАРИ ==="))
        for a, b in combinations(ids, 2):
            u1, u2 = _ordered_pair(users[a], users[b])
            self.stdout.write(f"\n--- {u1.id} ↔ {u2.id} ---")
            try:
                result = calculate_match(u1, u2)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"calculate_match впав: {e!r}"))
                continue

            self.stdout.write(json.dumps(result, ensure_ascii=False, indent=2))

            if opts["save"]:
                _save_result(u1, u2, result)
                self.stdout.write(self.style.SUCCESS("→ saved to MatchResult"))

            self._print_existing_record(u1, u2)

    def _ensure_embeddings(self, users):
        from user.matching.llm_scorer import compute_and_cache_embeddings

        for u in users:
            p = getattr(u, "profile", None)
            if p is None:
                continue
            if not p.embedding_vibe:
                self.stdout.write(f"Рахую embeddings для user {u.id}…")
                compute_and_cache_embeddings(p)
                p.refresh_from_db()

    def _print_preflight(self, users: dict):
        self.stdout.write(self.style.MIGRATE_HEADING("=== ПЕРЕДПОЛЬОТ ==="))
        for uid, u in users.items():
            complete, missing = is_profile_complete(u)
            has_housing = hasattr(u, "housing") and u.housing is not None
            has_profile = hasattr(u, "profile") and u.profile is not None
            has_emb = (
                has_profile
                and u.profile is not None
                and bool(u.profile.embedding_vibe)
            )
            h = getattr(u, "housing", None)
            pref_g = getattr(h, "preferred_gender", None) if h else None
            dest = getattr(h, "destination", None) if h else None
            self.stdout.write(
                f"user={uid:<4} gender={u.gender} "
                f"housing.preferred_gender={pref_g} destination={dest} "
                f"profile={has_profile} housing={has_housing} "
                f"complete={complete} embedding_vibe={'yes' if has_emb else 'NO'}"
            )
            if not complete:
                self.stdout.write(f"   missing: {missing}")

    def _print_existing_record(self, u1, u2):
        rec = MatchResult.objects.filter(user_1=u1, user_2=u2).first()
        if rec is None:
            self.stdout.write("   у БД: запису нема")
            return
        self.stdout.write(
            f"   у БД: status={rec.status} "
            f"hard_passed={rec.hard_filter_passed} "
            f"skip_reason={rec.skip_reason!r} "
            f"total={rec.total_score} stale={rec.is_stale}"
        )
