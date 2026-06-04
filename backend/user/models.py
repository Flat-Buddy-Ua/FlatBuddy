from datetime import date

from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

from django.contrib.postgres.fields import ArrayField

from user.constants.choices import *


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        # createsuperuser CLI prompts only for USERNAME_FIELD + REQUIRED_FIELDS,
        # but the model has more NOT NULL columns. Fill with placeholders so
        # admin accounts can be created without populating profile data.
        # Filter out is_staff=True from matching/listing queries to keep these
        # placeholder rows out of user-facing flows.
        extra_fields.setdefault('country', Country.UKRAINE)
        extra_fields.setdefault('city', 'admin')
        extra_fields.setdefault('gender', Gender.OTHER)
        extra_fields.setdefault('birthdate', date(2000, 1, 1))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None

    class Package(models.TextChoices):
        FREE    = "free",    "Безкоштовний"
        P25     = "p25",     "Пакет 25"
        P45     = "p45",     "Пакет 45"
        P55     = "p55",     "Пакет 55"
        PREMIUM = "premium", "Преміум (безліміт)"

    country = models.IntegerField(choices=Country.choices)
    city = models.CharField(max_length=100)
    gender = models.IntegerField(choices=Gender.choices)
    birthdate = models.DateField()
    phone_number = models.CharField(unique=True)
    email = models.EmailField(unique=True, max_length=254)
    is_active = models.BooleanField(default=False)
    package = models.CharField(
        max_length=7,
        choices=Package.choices,
        default=Package.FREE,
    )
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number']

    class Meta:
        managed = True
        db_table = 'user'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    status = models.IntegerField(choices=Status.choices, null=True, blank=True)
    orbit = models.IntegerField(choices=Orbit.choices, null=True, blank=True)
    languages = ArrayField(
        models.CharField(max_length=2, validators=[MinLengthValidator(2)], choices=Language.choices, null=True, blank=True),
        size=5,
        default=list
    )
    political_coordinate_economic = models.IntegerField(null=True, blank=True)
    political_coordinate_social = models.IntegerField(null=True, blank=True)
    cleanliness = models.IntegerField(null=True, blank=True)
    my_vibe = models.TextField(max_length=600, validators=[MinLengthValidator(200)], blank=True)
    buddy_vibe = models.TextField(max_length=600, validators=[MinLengthValidator(200)], blank=True)
    schedule = models.TextField(max_length=100, validators=[MinLengthValidator(3)], blank=True)
    sleep_schedule = models.TextField(max_length=100, validators=[MinLengthValidator(3)], blank=True)
    smoking = models.IntegerField(choices=Smoking.choices, null=True, blank=True)
    extra_intro_version = models.IntegerField(choices=Personality.choices, null=True, blank=True)
    hobbies = models.IntegerField(choices=Hobby.choices, null=True, blank=True)
    partying = models.IntegerField(choices=Partying.choices, null=True, blank=True)


    # Cached sentence-transformer embeddings (MiniLM-L12, dim=384)
    embedding_vibe = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_hobbies = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_schedule = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_updated_at = models.DateTimeField(
        null=True, blank=True
    )
    parsed_wake_hour  = models.FloatField(null=True, blank=True)
    parsed_sleep_hour = models.FloatField(null=True, blank=True)

    hobbies = ArrayField(
        models.IntegerField(choices=Hobby.choices),
        size=10,
        default=list,
        blank=True
    )
    custom_hobbies = ArrayField(
        models.CharField(max_length=50),
        size=5,
        default=list,
        blank=True,
    )
    partying = models.IntegerField(choices=Partying.choices, null=True, blank=True)

    embedding_vibe = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_hobbies = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_schedule = ArrayField(
        models.FloatField(), size=384, null=True, blank=True
    )
    embedding_updated_at = models.DateTimeField(
        null=True, blank=True
    )
    parsed_wake_hour  = models.FloatField(null=True, blank=True)
    parsed_sleep_hour = models.FloatField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'user_profile'

    def __str__(self):
        return f"Профіль {self.user.email}"

def user_directory_path(instance, filename):
    return f'user_photos/user_{instance.user_profile.user.id}/{filename}'

class UserPhoto(models.Model):
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='photos'
    )

    image = models.ImageField(upload_to=user_directory_path)

    class Meta:
        db_table = 'user_photo'

    def __str__(self):
        return f"Фото профілю {self.user_profile.user.email}"


class UserHousing(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='housing'
    )
    room_sharing_preference = models.IntegerField(choices=RoomSharing.choices, null=True, blank=True)
    preferred_gender = models.IntegerField(choices=PreferredGender.choices, null=True, blank=True)
    housing_status = models.IntegerField(choices=HousingStatus.choices, null=True, blank=True)
    budget_min = models.IntegerField(null=True, blank=True)
    budget_max = models.IntegerField(null=True, blank=True)
    destination = models.IntegerField(choices=City.choices, null=True, blank=True)
    preferred_districts = ArrayField(
        models.IntegerField(choices=District.choices, null=True, blank=True),
        blank=True,
        size=10,
        default=list
    )
    planned_duration = models.IntegerField(choices=PlannedDuration.choices, null=True, blank=True)
    move_in_date = models.DateField(null=True, blank=True)
    has_pet = models.BooleanField(default=False)
    pet_description = models.TextField(max_length=100, validators=[MinLengthValidator(3)], null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'user_housing'

    def __str__(self):
        return f"Житлові уподобання {self.user.email}"
    

class UserPriority(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='priority'
    )
    fields = ArrayField(
        models.CharField(max_length=30, choices=PriorityField.choices),
        size=3,
        default=list,
        blank=True
    )

    class Meta:
        db_table = 'user_priority'

    def __str__(self):
        return f"Пріоритети {self.user.email}: {self.fields}"


class MatchResult(models.Model):
    class Status(models.TextChoices):
        PENDING  = 'pending',  'Очікує обрахунку'
        DONE     = 'done',     'Розраховано'
        SKIPPED  = 'skipped',  'Пропущено (hard filter / неповна анкета)'
        ERROR    = 'error',    'Помилка'

    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_1')
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_2')
    total_score = models.FloatField(null=True, blank=True)
    status      = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    hard_filter_passed = models.BooleanField(default=False)
    skip_reason        = models.CharField(max_length=50, blank=True)

    score_vibe        = models.FloatField(null=True, blank=True)
    score_hobbies     = models.FloatField(null=True, blank=True)
    score_cleanliness = models.FloatField(null=True, blank=True)
    score_smoking     = models.FloatField(null=True, blank=True)
    score_partying    = models.FloatField(null=True, blank=True)
    score_political   = models.FloatField(null=True, blank=True)
    score_personality = models.FloatField(null=True, blank=True)
    score_schedule    = models.FloatField(null=True, blank=True)
    score_budget      = models.FloatField(null=True, blank=True)

    is_stale   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'match_result'
        unique_together = ('user_1', 'user_2')
        indexes = [
            models.Index(fields=['user_1', 'total_score']),
            models.Index(fields=['user_2', 'total_score']),
            models.Index(fields=['is_stale']),
        ]

    def __str__(self):
        return f"Match {self.user_1_id} ↔ {self.user_2_id}: {self.total_score}"


class SeenProfile(models.Model):
    user    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seen_profiles')
    match   = models.ForeignKey(MatchResult, on_delete=models.CASCADE, related_name='seen_by')
    seen_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'seen_profile'
        unique_together = ('user', 'match')
        indexes         = [models.Index(fields=['user', 'seen_at'])]

    def __str__(self):
        return f"Seen: user {self.user_id} → match {self.match_id}"


class UserLike(models.Model):
    from_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='likes_sent',
    )
    to_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='likes_received',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_like'
        unique_together = ('from_user', 'to_user')
        indexes = [
            models.Index(fields=['from_user']),
            models.Index(fields=['to_user']),
        ]

    def __str__(self):
        return f"{self.from_user_id} → {self.to_user_id}"


class UserMatch(models.Model):
    user_1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mutual_matches_1',
    )
    user_2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mutual_matches_2',
    )
    compatibility_score = models.FloatField(null=True, blank=True)
    matched_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_match'
        unique_together = ('user_1', 'user_2')
        indexes = [
            models.Index(fields=['user_1']),
            models.Index(fields=['user_2']),
        ]

    def __str__(self):
        return f"Match {self.user_1_id} ↔ {self.user_2_id}"


class ProfileUnlock(models.Model):
    class Status(models.TextChoices):
        PENDING  = 'pending',  'Очікує оплати'
        ACTIVE   = 'active',   'Активне (розблоковано)'
        REFUNDED = 'refunded', 'Повернуто'

    buyer = models.ForeignKey(
        'user.User',
        on_delete=models.CASCADE,
        related_name='unlocked_profiles',
    )
    match = models.ForeignKey(
        'user.MatchResult',
        on_delete=models.CASCADE,
        related_name='unlocks',
    )
    order = models.OneToOneField(
        'user.PaymentOrder',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='profile_unlock',
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    unlocked_at  = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'profile_unlock'
        unique_together = ('buyer', 'match')
        indexes = [
            models.Index(fields=['buyer', 'status']),
        ]

    def __str__(self):
        return f"Unlock buyer={self.buyer_id} match={self.match_id} [{self.status}]"

    def activate(self):
        self.status      = self.Status.ACTIVE
        self.unlocked_at = timezone.now()
        self.save(update_fields=['status', 'unlocked_at'])

class PaymentOrder(models.Model):
    class Status(models.TextChoices):
        PENDING  = 'pending',  'Очікує оплати'
        PAID     = 'paid',     'Оплачено'
        EXPIRED  = 'expired',  'Прострочено'

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_orders')
    comment_id = models.CharField(max_length=12, unique=True)
    amount_expected = models.IntegerField()
    status     = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    package    = models.CharField(max_length=7, choices=User.Package.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at    = models.DateTimeField(null=True, blank=True)
    class Type(models.TextChoices):
        PROFILE_UNLOCK = 'profile_unlock', 'Розблокування анкети'

    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.PROFILE_UNLOCK,
    )
    match = models.ForeignKey(
        'user.MatchResult',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='payment_orders',
    )
    class Meta:
        db_table = 'payment_order'
        
        
class UnmatchedPayment(models.Model):
    mono_id     = models.CharField(max_length=100, unique=True)
    amount      = models.IntegerField()
    description = models.CharField(max_length=255, blank=True)
    received_at = models.DateTimeField()
    created_at  = models.DateTimeField(auto_now_add=True)
    note        = models.TextField(blank=True)

    class Meta:
        db_table = 'unmatched_payment'

    def __str__(self):
        return f"UnmatchedPayment {self.mono_id} {self.amount/100:.0f}грн"