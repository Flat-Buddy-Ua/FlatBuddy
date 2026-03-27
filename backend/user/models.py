from django.db import models
from django.db.models import JSONField
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager

# ROOM_SHARING_CHOICES = [
#     ('Mені комфортно ділити кімнату з співмешканцем',
#      'Mені комфортно ділити кімнату з співмешканцем'),
#     ('Я хочу мати окрему кімнату', 'Я хочу мати окрему кімнату'),
# ]

# PREFERRED_GENDER_CHOICES = [
#     ('Лише з хлопцями', 'Лише з хлопцями'),
#     ('Лише з дівчатами', 'Лише з дівчатами'),
#     ('Не має значення', 'Не має значення'),
# ]

# HOUSING_STATUS_CHOICES = [
#     ('Я шукаю квартиру та співмешканця', 'Я шукаю квартиру та співмешканця'),
#     ('Я шукаю лише співмешканця, маю свою/орендовану квартиру',
#      'Я шукаю лише співмешканця, маю свою/орендовану квартиру'),
# ]


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

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    country = models.CharField(null=True, blank=True)
    city = models.CharField(null=True, blank=True)
    gender = models.CharField(null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    phone_number = models.CharField(unique=True, blank=True)
    email = models.EmailField(
        unique=True, max_length=50, null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        managed = True
        db_table = 'user'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class UserProfile(models.Model):
    profile_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,

        related_name='profile'
    )

    university = models.CharField(
        max_length=100)
    specialization = models.CharField(
        max_length=50, validators=[MinLengthValidator(3)])
    study_year = models.CharField(max_length=50)
    languages = models.JSONField()
    political_view = models.JSONField()
    cleanliness = models.IntegerField()
    lifestyle = models.TextField()
    schedule = models.TextField(max_length=100, validators=[
                                MinLengthValidator(3)])
    sleep_schedule = models.TextField(
        max_length=100, validators=[MinLengthValidator(3)])
    bad_habits = models.TextField(
        max_length=100, validators=[MinLengthValidator(3)])
    mbti = models.JSONField()
    extra_intro_version = models.CharField(
        max_length=100)
    hobbies = models.TextField(max_length=200, validators=[
                               MinLengthValidator(3)])
    bio = models.TextField(max_length=300, validators=[MinLengthValidator(3)])
    looking_for = models.TextField(
        max_length=200, validators=[MinLengthValidator(3)])

    class Meta:
        managed = True
        db_table = 'user_profile'

    def __str__(self):
        return f"Профіль {self.user.email}"


class UserPhoto(models.Model):
    image_id = models.AutoField(primary_key=True)
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        db_column='user_profile',
        related_name='photos'
    )

    image = models.ImageField(
        upload_to='user_photos/')

    class Meta:
        managed = True
        db_table = 'user_photo'

    def __str__(self):
        return f"Фото профілю {self.user_profile.user.email}"


class UserHousing(models.Model):
    housing_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='housing'
    )
    room_sharing_preference = models.CharField(
        max_length=100
    )
    preferred_gender = models.CharField(
        max_length=30
    )
    housing_status = models.CharField(
        max_length=100
    )
    budget = models.IntegerField()
    preferred_districts = models.JSONField()
    planned_duration = models.CharField(
        max_length=50, validators=[MinLengthValidator(3)])
    move_in_date = models.CharField(
        max_length=50, validators=[MinLengthValidator(3)])
    has_pet = models.BooleanField()
    pet_description = models.TextField(
        blank=True, null=True, max_length=100, validators=[MinLengthValidator(3)])

    class Meta:
        managed = True
        db_table = 'user_housing'

    def __str__(self):
        return f"Житлові уподобання {self.user.email}"
