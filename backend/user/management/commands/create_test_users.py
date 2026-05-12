"""
python manage.py create_test_users

Створює 5 тестових юзерів з повними профілями та MatchResult записами
відносно юзера з TARGET_USER_ID (Роман Яцишин, id=53).
Celery не потрібен — MatchResult створюється напряму.
"""

from datetime import date
from django.core.management.base import BaseCommand
from django.db import transaction

TARGET_USER_ID = 53  # Роман Яцишин


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
    # ── Юзер 1: дуже високий скор ────────────────────────────────────────
    {
        "user": {
            "first_name": "Андрій",
            "last_name": "Мельник",
            "email": "test.andriy.melnyk@flatbuddy.test",
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
    # ── Юзер 2: високий скор ─────────────────────────────────────────────
    {
        "user": {
            "first_name": "Софія",
            "last_name": "Павленко",
            "email": "test.sofia.pavlenko@flatbuddy.test",
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
    # ── Юзер 3: середній скор ────────────────────────────────────────────
    {
        "user": {
            "first_name": "Дмитро",
            "last_name": "Бондаренко",
            "email": "test.dmytro.bondarenko@flatbuddy.test",
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
    # ── Юзер 4: середньо-низький скор ────────────────────────────────────
    {
        "user": {
            "first_name": "Марія",
            "last_name": "Савченко",
            "email": "test.maria.savchenko@flatbuddy.test",
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
    # ── Юзер 5: низький скор ─────────────────────────────────────────────
    {
        "user": {
            "first_name": "Іван",
            "last_name": "Кравченко",
            "email": "test.ivan.kravchenko@flatbuddy.test",
            "phone_number": "+380991000005",
            "country": 1,
            "city": "Київ",
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
            "sleep_schedule": "Нестабільний графік.",
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
    help = "Створює 5 тестових юзерів та MatchResult записи для юзера id=53"

    def add_arguments(self, parser):
        parser.add_argument(
            "--delete",
            action="store_true",
            help="Видалити тестових юзерів замість створення",
        )

    def handle(self, *args, **options):
        if options["delete"]:
            self._delete_test_users()
            return
        self._create_test_users()

    def _delete_test_users(self):
        from user.models import User
        emails = [u["user"]["email"] for u in TEST_USERS]
        deleted, _ = User.objects.filter(email__in=emails).delete()
        self.stdout.write(self.style.SUCCESS(f"Видалено {deleted} об'єктів"))

    @transaction.atomic
    def _create_test_users(self):
        from user.models import (
            User, UserProfile, UserHousing, UserPhoto, MatchResult
        )

        try:
            roman = User.objects.get(id=TARGET_USER_ID)
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(f"Юзер з id={TARGET_USER_ID} не знайдений!")
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

            # ── MatchResult ───────────────────────────────────────────────
            s = data["scores"]
            u1, u2 = (roman, user) if roman.id < user.id else (user, roman)

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
            self.stdout.write(
                self.style.SUCCESS(
                    f"  ✓ {user.first_name} {user.last_name} "
                    f"(id={user.id}) — скор {s['total']}"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nГотово: створено {created_count} юзерів та MatchResult записів."
                f"\nЗапусти: python manage.py create_test_users --delete  щоб прибрати їх."
            )
        )
