from django.contrib import admin

from .models import (
    User, UserProfile, UserHousing, UserPhoto,
    UserPriority, MatchResult, SeenProfile,
    UserLike, UserMatch,
)


# ── Inlines, щоб у картці юзера бачити повʼязане ──────────────────────────

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0
    classes = ('collapse',)


class UserHousingInline(admin.StackedInline):
    model = UserHousing
    can_delete = False
    extra = 0
    classes = ('collapse',)


class UserPhotoInline(admin.TabularInline):
    model = UserPhoto
    fk_name = 'user_profile'
    extra = 0
    readonly_fields = ('image',)


# ── User ──────────────────────────────────────────────────────────────────

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'email', 'first_name', 'last_name',
        'gender', 'city', 'package', 'is_active', 'date_joined',
    )
    list_filter = (
        'is_active', 'is_staff', 'gender', 'country', 'city', 'package',
    )
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    date_hierarchy = 'date_joined'
    ordering = ('-date_joined',)
    list_per_page = 50
    readonly_fields = ('date_joined', 'last_login', 'password')
    fieldsets = (
        (None, {
            'fields': ('email', 'phone_number', 'is_active', 'is_staff', 'is_superuser'),
        }),
        ('Особисте', {
            'fields': ('first_name', 'last_name', 'gender', 'birthdate', 'country', 'city'),
        }),
        ('Пакет', {
            'fields': ('package',),
        }),
        ('Службове', {
            'fields': ('date_joined', 'last_login', 'password'),
            'classes': ('collapse',),
        }),
    )
    inlines = (UserProfileInline, UserHousingInline)
    actions = ('make_premium', 'make_free')

    @admin.action(description="Перевести в Premium")
    def make_premium(self, request, queryset):
        n = queryset.update(package=User.Package.PREMIUM)
        self.message_user(request, f"Premium: {n}")

    @admin.action(description="Перевести в Free")
    def make_free(self, request, queryset):
        n = queryset.update(package=User.Package.FREE)
        self.message_user(request, f"Free: {n}")


# ── UserProfile ───────────────────────────────────────────────────────────

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'status', 'orbit', 'cleanliness',
        'smoking', 'partying', 'extra_intro_version',
        'has_embedding', 'short_vibe',
    )
    list_filter = (
        'status', 'orbit', 'cleanliness', 'smoking',
        'partying', 'extra_intro_version',
    )
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'my_vibe', 'buddy_vibe')
    raw_id_fields = ('user',)
    list_select_related = ('user',)
    list_per_page = 50
    readonly_fields = ('embedding_updated_at', 'parsed_wake_hour', 'parsed_sleep_hour')
    fieldsets = (
        (None, {
            'fields': ('user', 'status', 'orbit', 'languages'),
        }),
        ('Особистість', {
            'fields': (
                'my_vibe', 'buddy_vibe',
                'cleanliness', 'extra_intro_version',
                'political_coordinate_economic', 'political_coordinate_social',
            ),
        }),
        ('Стиль життя', {
            'fields': ('schedule', 'sleep_schedule', 'smoking', 'partying'),
        }),
        ('Хобі', {
            'fields': ('hobbies', 'custom_hobbies'),
        }),
        ('Cache', {
            'fields': ('embedding_updated_at', 'parsed_wake_hour', 'parsed_sleep_hour'),
            'classes': ('collapse',),
        }),
    )
    actions = ('reset_embeddings',)

    @admin.display(boolean=True, description='Embedding?')
    def has_embedding(self, obj):
        return bool(obj.embedding_vibe)

    @admin.display(description='Vibe')
    def short_vibe(self, obj):
        text = obj.my_vibe or ''
        return (text[:60] + '…') if len(text) > 60 else text

    @admin.action(description="Скинути embeddings (наступний save їх перерахує)")
    def reset_embeddings(self, request, queryset):
        n = queryset.update(
            embedding_vibe=None, embedding_hobbies=None,
            embedding_schedule=None, embedding_updated_at=None,
        )
        self.message_user(request, f"Скинуто embeddings: {n}")


# ── UserHousing ───────────────────────────────────────────────────────────

@admin.register(UserHousing)
class UserHousingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'destination', 'housing_status', 'preferred_gender',
        'room_sharing_preference', 'budget_min', 'budget_max',
        'planned_duration', 'move_in_date', 'has_pet',
    )
    list_filter = (
        'destination', 'housing_status', 'preferred_gender',
        'room_sharing_preference', 'planned_duration', 'has_pet',
    )
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user',)
    list_select_related = ('user',)
    date_hierarchy = 'move_in_date'
    ordering = ('-id',)
    list_per_page = 50


# ── UserPhoto ─────────────────────────────────────────────────────────────

@admin.register(UserPhoto)
class UserPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_profile', 'image')
    search_fields = ('user_profile__user__email',)
    raw_id_fields = ('user_profile',)
    list_per_page = 50


# ── UserPriority ──────────────────────────────────────────────────────────

@admin.register(UserPriority)
class UserPriorityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'fields')
    search_fields = ('user__email',)
    raw_id_fields = ('user',)
    list_select_related = ('user',)
    list_per_page = 50


# ── MatchResult ───────────────────────────────────────────────────────────

@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_1', 'user_2',
        'total_score', 'status', 'hard_filter_passed',
        'is_stale', 'skip_reason', 'updated_at',
    )
    list_filter = ('status', 'is_stale', 'hard_filter_passed', 'skip_reason')
    search_fields = ('user_1__email', 'user_2__email')
    raw_id_fields = ('user_1', 'user_2')
    ordering = ('-total_score',)
    date_hierarchy = 'updated_at'
    list_per_page = 50
    list_select_related = ('user_1', 'user_2')
    readonly_fields = (
        'total_score',
        'score_vibe', 'score_hobbies', 'score_cleanliness', 'score_budget',
        'score_smoking', 'score_partying', 'score_political',
        'score_personality', 'score_schedule',
        'created_at', 'updated_at',
    )
    fieldsets = (
        (None, {
            'fields': ('user_1', 'user_2', 'status', 'hard_filter_passed', 'skip_reason', 'is_stale'),
        }),
        ('Скори', {
            'fields': (
                'total_score',
                'score_vibe', 'score_budget', 'score_hobbies', 'score_cleanliness',
                'score_smoking', 'score_partying', 'score_political',
                'score_personality', 'score_schedule',
            ),
        }),
        ('Службове', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    actions = ('mark_stale', 'mark_fresh', 'recompute_selected')

    @admin.action(description="Позначити обрані матчі як stale")
    def mark_stale(self, request, queryset):
        updated = queryset.update(is_stale=True)
        self.message_user(request, f"Позначено stale: {updated}")

    @admin.action(description="Зняти прапорець stale з обраних матчів")
    def mark_fresh(self, request, queryset):
        updated = queryset.update(is_stale=False)
        self.message_user(request, f"Знято stale: {updated}")

    @admin.action(description="Перерахувати обрані пари синхронно")
    def recompute_selected(self, request, queryset):
        from user.matching.engine import calculate_match
        from user.matching.tasks import _save_result

        ok, fail = 0, 0
        for m in queryset.select_related('user_1', 'user_2'):
            try:
                result = calculate_match(m.user_1, m.user_2)
                _save_result(m.user_1, m.user_2, result)
                ok += 1
            except Exception:
                fail += 1
        self.message_user(request, f"Перераховано: {ok}, помилок: {fail}")


# ── SeenProfile ───────────────────────────────────────────────────────────

@admin.register(SeenProfile)
class SeenProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'match', 'seen_at')
    list_filter = ('seen_at',)
    search_fields = ('user__email',)
    raw_id_fields = ('user', 'match')
    date_hierarchy = 'seen_at'
    ordering = ('-seen_at',)
    list_per_page = 50
    list_select_related = ('user', 'match')
    readonly_fields = ('seen_at',)


# ── UserLike ──────────────────────────────────────────────────────────────

@admin.register(UserLike)
class UserLikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'from_user', 'to_user', 'created_at')
    search_fields = (
        'from_user__email', 'from_user__first_name',
        'to_user__email',   'to_user__first_name',
    )
    raw_id_fields = ('from_user', 'to_user')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 50
    list_select_related = ('from_user', 'to_user')


# ── UserMatch ─────────────────────────────────────────────────────────────

@admin.register(UserMatch)
class UserMatchAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_1', 'user_2', 'compatibility_score',
        'is_active', 'matched_at',
    )
    list_filter = ('is_active',)
    search_fields = (
        'user_1__email', 'user_1__first_name',
        'user_2__email', 'user_2__first_name',
    )
    raw_id_fields = ('user_1', 'user_2')
    date_hierarchy = 'matched_at'
    ordering = ('-matched_at',)
    list_per_page = 50
    list_select_related = ('user_1', 'user_2')
    actions = ('deactivate', 'activate')

    @admin.action(description="Деактивувати матч")
    def deactivate(self, request, queryset):
        n = queryset.update(is_active=False)
        self.message_user(request, f"Деактивовано: {n}")

    @admin.action(description="Активувати матч")
    def activate(self, request, queryset):
        n = queryset.update(is_active=True)
        self.message_user(request, f"Активовано: {n}")
