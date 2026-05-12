"""
Створює 5 тестових юзерів з повними профілями та MatchResult записами.

Як це працює:
  1. Для кожного тестового юзера зі списку TEST_USERS:
     - Створює User (is_active=True, package=premium)
     - Створює UserProfile з заповненими полями
     - Створює UserPhoto-заглушку (щоб пройти checkCompleteness на фронті)
     - Створює UserHousing
     - Створює MatchResult між цільовим юзером і тестовим зі штучними скорами
  2. Celery НЕ потрібен — MatchResult пишеться напряму в БД.
  3. SeenProfile не скидається — якщо раніше переглядав, знову не з'явиться.
     Запусти з --reset-seen щоб очистити.

Використання:
  python manage.py create_test_users                  # target id=53 (дефолт)
  python manage.py create_test_users --target-id 12   # інший юзер
  python manage.py create_test_users --delete         # видалити тестових юзерів
  python manage.py create_test_users --reset-seen     # очистити SeenProfile для цільового юзера
"""

from datetime import date
from django.core.management.base import BaseCommand
from django.db import transaction


VIBE_LONG = (
    "Студент третього курсу, навчаюсь на денній формі. "
    "Люблю порядок у спільних зонах — кухня та ванна завжди чисті після мене. "
    "Вечорами зазвичай вдома: читаю, дивлюсь серіали або займаюсь своїми справами. "
    "Не курю в приміщенні, до гостей ставлюсь нормально якщо попередити заздалегідь. "
    "Шукаю спокійного сусіда з яким можна мирно співіснувати без зайвого драматизму."
)

BUDDY_LONG = (
    "Шукаю охайного та адекватного сусіда приблизно мого віку. "
    "Важливо щоб людина прибирала за собою на кухні та у ванній. "
    "Не проти якщо будеш приводити друзів, але бажано не в будні до пізна. "
    "Стать не має значення, головне — взаємна повага до особистого простору. "
    "Якщо ти студент або працюєш і цінуєш тишу по вечорах — ми точно зійдемось."
)

TEST_USERS = [
    # ── Тест 1: дуже високий скор ─────────────────────────────────────────
    {
        "user": {
            "first_name": "Тест",
            "last_name": "Один",
            "email": "test.user.1@flatbuddy.test",
            "phone_number": "+380991000001",
            "country": 1,
            "city": "Львів",
            "gender": 1,
            "birthdate": date(2005, 4, 20),
            "is_active": True,
            "package": "premium",
            "password": "TestPass123!",
        },
        "profile": {
            "status": 3,
            "orbit": 1,
            "languages": ["uk", "en"],
            "political_coordinate_economic": -4,
            "political_coordinate_social": 4,
            "cleanliness": 4,
            "my_vibe": VIBE_LONG,
            "buddy_vibe": BUDDY_LONG,
            "schedule": "Університет 9:00–15:00, після обіду дома або в бібліотеці.",
            "sleep_schedule": "Лягаю о 23:30, встаю о 7:30.",
            "smoking": 2,
            "partying": 3,
            "extra_intro_version": 1,
            "hobbies": [4, 2],
            "custom_hobbies": [],
        },
        "housing": {
            "room_sharing_preference": 1,
            "preferred_gender": 3,
            "housing_status": 1,
            "budget_min": 6000,
            "budget_max": 9500,
            "destination": 2,
            "preferred_districts": [11, 12, 13, 14, 15],
            "planned_duration": 2,
            "move_in_date": date(2026, 6, 1),
            "has_pet": False,
        },
        "scores": {
            "total": 0.91,
            "vibe": 0.88, "hobbies": 0.90, "cleanliness": 1.00,
            "smoking": 1.00, "partying": 1.00, "political": 0.90,
            "personality": 1.00, "schedule": 0.70,
        },
    },
    # ── Тест 2: високий скор ──────────────────────────────────────────────
    {
        "user": {
            "first_name": "Тест",
            "last_name": "Два",
            "email": "test.user.2@flatbuddy.test",
            "phone_number": "+380991000002",
            "country": 1,
            "city": "Львів",
            "gender": 2,
            "birthdate": date(2005, 9, 12),
            "is_active": True,
            "package": "premium",
            "password": "TestPass123!",
        },
        "profile": {
            "status": 3,
            "orbit": 1,
            "languages": ["uk", "en", "pl"],
            "political_coordinate_economic": -3,
            "political_coordinate_social": 3,
            "cleanliness": 5,
            "my_vibe": VIBE_LONG,
            "buddy_vibe": BUDDY_LONG,
            "schedule": "Навчання з 8:30 до 14:00, решта дня вільна.",
            "sleep_schedule": "Лягаю о 23:00, встаю о 7:00.",
            "smoking": 2,
            "partying": 2,
            "extra_intro_version": 0,
            "hobbies": [4, 7],
            "custom_hobbies": [],
        },
        "housing": {
            "room_sharing_preference": 1,
            "preferred_gender": 3,
            "housing_status": 1,
            "budget_min": 7000,
            "budget_max": 11000,
            "destination": 2,
            "preferred_districts": [12, 13, 14, 15, 16],
            "planned_duration": 2,
            "move_in_date": date(2026, 5, 25),
            "has_pet": False,
        },
        "scores": {
            "total": 0.83,
            "vibe": 0.82, "hobbies": 0.75, "cleanliness": 0.75,
            "smoking": 1.00, "partying": 0.75, "political": 0.85,
            "personality": 0.50, "schedule": 0.80,
        },
    },
    # ── Тест 3: середній скор ─────────────────────────────────────────────
    {
        "user": {
            "first_name": "Тест",
            "last_name": "Три",
            "email": "test.user.3@flatbuddy.test",
            "phone_number": "+380991000003",
            "country": 1,
            "city": "Львів",
            "gender": 1,
            "birthdate": date(2004, 1, 5),
            "is_active": True,
            "package": "premium",
            "password": "TestPass123!",
        },
        "profile": {
            "status": 2,
            "orbit": 2,
            "languages": ["uk"],
            "political_coordinate_economic": 2,
            "political_coordinate_social": 6,
            "cleanliness": 3,
            "my_vibe": VIBE_LONG,
            "buddy_vibe": BUDDY_LONG,
            "schedule": "Робота з 10:00 до 19:00, вечори дома.",
            "sleep_schedule": "Лягаю о 00:30, встаю о 8:30.",
            "smoking": 3,
            "partying": 3,
            "extra_intro_version": 0,
            "hobbies": [1, 5],
            "custom_hobbies": ["Настільні ігри"],
        },
        "housing": {
            "room_sharing_preference": 1,
            "preferred_gender": 1,
            "housing_status": 1,
            "budget_min": 5000,
            "budget_max": 8000,
            "destination": 2,
            "preferred_districts": [11, 13, 15],
            "planned_duration": 3,
            "move_in_date": date(2026, 7, 1),
            "has_pet": False,
        },
        "scores": {
            "total": 0.64,
            "vibe": 0.65, "hobbies": 0.40, "cleanliness": 0.75,
            "smoking": 0.50, "partying": 1.00, "political": 0.60,
            "personality": 0.50, "schedule": 0.55,
        },
    },
    # ── Тест 4: середньо-низький скор ─────────────────────────────────────
    {
        "user": {
            "first_name": "Тест",
            "last_name": "Чотири",
            "email": "test.user.4@flatbuddy.test",
            "phone_number": "+380991000004",
            "country": 1,
            "city": "Львів",
            "gender": 2,
            "birthdate": date(2003, 6, 18),
            "is_active": True,
            "package": "premium",
            "password": "TestPass123!",
        },
        "profile": {
            "status": 1,
            "orbit": 3,
            "languages": ["uk", "en"],
            "political_coordinate_economic": 5,
            "political_coordinate_social": -3,
            "cleanliness": 2,
            "my_vibe": VIBE_LONG,
            "buddy_vibe": BUDDY_LONG,
            "schedule": "Гнучкий графік, вдома буваю по-різному.",
            "sleep_schedule": "Лягаю о 2:00, встаю о 10:00.",
            "smoking": 1,
            "partying": 4,
            "extra_intro_version": -1,
            "hobbies": [3, 6],
            "custom_hobbies": [],
        },
        "housing": {
            "room_sharing_preference": 2,
            "preferred_gender": 2,
            "housing_status": 2,
            "budget_min": 8000,
            "budget_max": 14000,
            "destination": 2,
            "preferred_districts": [11, 16],
            "planned_duration": 4,
            "move_in_date": date(2026, 8, 1),
            "has_pet": True,
            "pet_description": "Кіт",
        },
        "scores": {
            "total": 0.47,
            "vibe": 0.50, "hobbies": 0.30, "cleanliness": 0.25,
            "smoking": 0.25, "partying": 0.50, "political": 0.40,
            "personality": 0.00, "schedule": 0.30,
        },
    },
    # ── Тест 5: низький скор ──────────────────────────────────────────────
    {
        "user": {
            "first_name": "Тест",
            "last_name": "П'ять",
            "email": "test.user.5@flatbuddy.test",
            "phone_number": "+380991000005",
            "country": 1,
            "city": "Львів",
            "gender": 1,
            "birthdate": date(2001, 11, 30),
            "is_active": True,
            "package": "premium",
            "password": "TestPass123!",
        },
        "profile": {
            "status": 2,
            "orbit": 4,
            "languages": ["uk"],
            "political_coordinate_economic": 8,
            "political_coordinate_social": -7,
            "cleanliness": 1,
            "my_vibe": VIBE_LONG,
            "buddy_vibe": BUDDY_LONG,
            "schedule": "Працюю позмінно, буваю вдома в різний час.",
            "sleep_schedule": "Нестабільний графік сну.",
            "smoking": 4,
            "partying": 5,
            "extra_intro_version": -1,
            "hobbies": [8, 9],
            "custom_hobbies": [],
        },
        "housing": {
            "room_sharing_preference": 2,
            "preferred_gender": 1,
            "housing_status": 1,
            "budget_min": 4000,
            "budget_max": 6500,
            "destination": 2,
            "preferred_districts": [11],
            "planned_duration": 1,
            "move_in_date": date(2026, 9, 1),
            "has_pet": False,
        },
        "scores": {
            "total": 0.28,
            "vibe": 0.30, "hobbies": 0.10, "cleanliness": 0.00,
            "smoking": 0.00, "partying": 0.25, "political": 0.10,
            "personality": 0.00, "schedule": 0.25,
        },
    },
]


class Command(BaseCommand):
    help = "Створює 5 тестових юзерів та MatchResult записи для цільового юзера"

    def add_arguments(self, parser):
        parser.add_argument(
            "--target-id",
            type=int,
            default=53,
            help="ID юзера відносно якого створювати матчі (дефолт: 53)",
        )
        parser.add_argument(
            "--delete",
            action="store_true",
            help="Видалити тестових юзерів та їхні матчі",
        )
        parser.add_argument(
            "--reset-seen",
            action="store_true",
            help="Очистити SeenProfile для цільового юзера (щоб побачити матчі знову)",
        )

    def handle(self, *args, **options):
        target_id = options["target_id"]

        if options["reset_seen"]:
            self._reset_seen(target_id)

        if options["delete"]:
            self._delete_test_users(target_id)
            return

        if not options["reset_seen"]:
            self._create_test_users(target_id)

    def _reset_seen(self, target_id):
        from user.models import SeenProfile
        deleted, _ = SeenProfile.objects.filter(user_id=target_id).delete()
        self.stdout.write(self.style.SUCCESS(
            f"SeenProfile: видалено {deleted} записів для user_id={target_id}"
        ))

    def _delete_test_users(self, target_id):
        from user.models import User, MatchResult
        emails = [u["user"]["email"] for u in TEST_USERS]
        # Видаляємо MatchResult спочатку
        from django.db.models import Q
        user_ids = list(User.objects.filter(email__in=emails).values_list("id", flat=True))
        if user_ids:
            MatchResult.objects.filter(
                Q(user_1_id__in=user_ids) | Q(user_2_id__in=user_ids)
            ).delete()
        deleted, _ = User.objects.filter(email__in=emails).delete()
        self.stdout.write(self.style.SUCCESS(f"Видалено {deleted} об'єктів"))

    @transaction.atomic
    def _create_test_users(self, target_id):
        from user.models import (
            User, UserProfile, UserHousing, UserPhoto, MatchResult
        )

        try:
            target = User.objects.get(id=target_id)
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(f"Юзер з id={target_id} не знайдений!")
            )
            return

        created_count = 0

        for data in TEST_USERS:
            email = data["user"]["email"]

            if User.objects.filter(email=email).exists():
                self.stdout.write(f"  Пропускаємо {email} — вже існує")
                continue

            # ── User ──────────────────────────────────────────────────────
            u_data = data["user"].copy()
            password = u_data.pop("password")
            user = User(**u_data)
            user.set_password(password)
            user.save()

            # ── UserProfile ───────────────────────────────────────────────
            p_data = data["profile"].copy()
            profile = UserProfile.objects.create(user=user, **p_data)

            # ── Фото-заглушка (щоб пройти checkCompleteness на фронті) ────
            photo = UserPhoto(user_profile=profile)
            photo.image = f"user_photos/user_{user.id}/placeholder.jpg"
            photo.save()

            # ── UserHousing ───────────────────────────────────────────────
            UserHousing.objects.create(user=user, **data["housing"])

            # ── MatchResult (user_1.id < user_2.id завжди) ───────────────
            s = data["scores"]
            u1, u2 = (target, user) if target.id < user.id else (user, target)

            MatchResult.objects.update_or_create(
                user_1=u1,
                user_2=u2,
                defaults={
                    "total_score":        s["total"],
                    "score_vibe":         s["vibe"],
                    "score_hobbies":      s["hobbies"],
                    "score_cleanliness":  s["cleanliness"],
                    "score_smoking":      s["smoking"],
                    "score_partying":     s["partying"],
                    "score_political":    s["political"],
                    "score_personality":  s["personality"],
                    "score_schedule":     s["schedule"],
                    "status":             MatchResult.Status.DONE,
                    "hard_filter_passed": True,
                    "is_stale":           False,
                },
            )

            created_count += 1
            self.stdout.write(self.style.SUCCESS(
                f"  ✓ {user.first_name} {user.last_name} "
                f"(id={user.id}) — скор {s['total']}"
            ))

        self.stdout.write(self.style.SUCCESS(
            f"\nГотово: створено {created_count} юзерів.\n"
            f"Щоб видалити: python manage.py create_test_users --delete\n"
            f"Щоб скинути переглянуті: python manage.py create_test_users --reset-seen"
        ))
