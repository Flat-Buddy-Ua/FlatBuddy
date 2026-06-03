from django.contrib import admin, messages
from django.utils import timezone
from django.utils.html import format_html

from .models import (
    User, UserProfile, UserHousing, UserPhoto,
    UserPriority, MatchResult, SeenProfile,
    UserLike, UserMatch,
    PaymentOrder, ProfileUnlock,
)


# ══════════════════════════════════════════════════════════════════════════════
#  Inlines
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  User
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  UserProfile
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  UserHousing
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  UserPhoto
# ══════════════════════════════════════════════════════════════════════════════

@admin.register(UserPhoto)
class UserPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_profile', 'image')
    search_fields = ('user_profile__user__email',)
    raw_id_fields = ('user_profile',)
    list_per_page = 50


# ══════════════════════════════════════════════════════════════════════════════
#  UserPriority
# ══════════════════════════════════════════════════════════════════════════════

@admin.register(UserPriority)
class UserPriorityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'fields')
    search_fields = ('user__email',)
    raw_id_fields = ('user',)
    list_select_related = ('user',)
    list_per_page = 50


# ══════════════════════════════════════════════════════════════════════════════
#  MatchResult
# ══════════════════════════════════════════════════════════════════════════════

@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_1_link', 'user_2_link',
        'total_score_display', 'status_badge', 'hard_filter_passed',
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

    @admin.display(description="Користувач 1")
    def user_1_link(self, obj):
        return format_html(
            '<a href="/admin/user/user/{}/change/">{}</a>',
            obj.user_1_id, obj.user_1,
        )

    @admin.display(description="Користувач 2")
    def user_2_link(self, obj):
        return format_html(
            '<a href="/admin/user/user/{}/change/">{}</a>',
            obj.user_2_id, obj.user_2,
        )

    @admin.display(description="Сумісність")
    def total_score_display(self, obj):
        if obj.total_score is None:
            return "—"
        score = round(obj.total_score)
        color = "#3aaf6f" if score >= 75 else "#F58A3D" if score >= 50 else "#e04b3a"
        return format_html(
            '<span style="color:{}; font-weight:700;">{}%</span>', color, score
        )

    @admin.display(description="Статус")
    def status_badge(self, obj):
        colors = {
            MatchResult.Status.PENDING: ("#F58A3D", "Очікує"),
            MatchResult.Status.DONE:    ("#3aaf6f", "Розраховано"),
            MatchResult.Status.SKIPPED: ("#aaa",    "Пропущено"),
            MatchResult.Status.ERROR:   ("#e04b3a", "Помилка"),
        }
        color, label = colors.get(obj.status, ("#aaa", obj.status))
        return format_html(
            '<span style="color:{}; font-weight:700;">{}</span>', color, label
        )


# ══════════════════════════════════════════════════════════════════════════════
#  SeenProfile
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  UserLike
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  UserMatch
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
#  PaymentOrder
# ══════════════════════════════════════════════════════════════════════════════

@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id", "comment_id", "user_link", "type",
        "amount_uah", "status_badge", "package",
        "created_at", "paid_at",
    )
    list_filter  = ("status", "type", "package")
    search_fields = ("comment_id", "user__email", "user__id")
    readonly_fields = (
        "comment_id", "user", "match", "type",
        "amount_expected", "package", "created_at", "paid_at",
    )
    ordering = ("-created_at",)
    raw_id_fields = ("user", "match")
    list_per_page = 50
    actions = ["action_mark_paid", "action_mark_expired"]

    @admin.action(description="✅ Позначити як оплачено та активувати unlock")
    def action_mark_paid(self, request, queryset):
        activated = 0
        skipped   = 0

        for order in queryset.select_related("profile_unlock"):
            if order.status == PaymentOrder.Status.PAID:
                skipped += 1
                continue

            order.status  = PaymentOrder.Status.PAID
            order.paid_at = timezone.now()
            order.save(update_fields=["status", "paid_at"])

            try:
                unlock = order.profile_unlock
                if unlock.status != ProfileUnlock.Status.ACTIVE:
                    unlock.activate()
                activated += 1
            except ProfileUnlock.DoesNotExist:
                skipped += 1

        self.message_user(
            request,
            f"Активовано: {activated}. Пропущено (вже оплачено або немає unlock): {skipped}.",
            messages.SUCCESS,
        )

    @admin.action(description="⏳ Позначити як прострочено")
    def action_mark_expired(self, request, queryset):
        updated = queryset.filter(
            status=PaymentOrder.Status.PENDING
        ).update(status=PaymentOrder.Status.EXPIRED)
        self.message_user(request, f"Прострочено: {updated} замовлень.", messages.WARNING)

    @admin.display(description="Користувач")
    def user_link(self, obj):
        return format_html(
            '<a href="/admin/user/user/{}/change/">{}</a>',
            obj.user_id, obj.user,
        )

    @admin.display(description="Сума")
    def amount_uah(self, obj):
        return f"{obj.amount_expected / 100:.0f} грн"

    @admin.display(description="Статус")
    def status_badge(self, obj):
        colors = {
            PaymentOrder.Status.PENDING: ("#F58A3D", "Очікує"),
            PaymentOrder.Status.PAID:    ("#3aaf6f", "Оплачено"),
            PaymentOrder.Status.EXPIRED: ("#aaa",    "Прострочено"),
        }
        color, label = colors.get(obj.status, ("#aaa", obj.status))
        return format_html(
            '<span style="color:{}; font-weight:700;">{}</span>', color, label
        )


# ══════════════════════════════════════════════════════════════════════════════
#  ProfileUnlock
# ══════════════════════════════════════════════════════════════════════════════

@admin.register(ProfileUnlock)
class ProfileUnlockAdmin(admin.ModelAdmin):
    list_display = (
        "id", "buyer_link", "match_id",
        "status_badge", "order_link",
        "unlocked_at", "created_at",
    )
    list_filter  = ("status",)
    search_fields = ("buyer__email", "buyer__id", "order__comment_id")
    readonly_fields = ("buyer", "match", "order", "created_at", "unlocked_at")
    ordering = ("-created_at",)
    raw_id_fields = ("buyer", "match", "order")
    list_per_page = 50
    actions = ["action_activate", "action_refund"]

    @admin.action(description="✅ Активувати розблокування вручну")
    def action_activate(self, request, queryset):
        activated = 0
        skipped   = 0

        for unlock in queryset:
            if unlock.status == ProfileUnlock.Status.ACTIVE:
                skipped += 1
                continue
            unlock.activate()

            if unlock.order and unlock.order.status != PaymentOrder.Status.PAID:
                unlock.order.status  = PaymentOrder.Status.PAID
                unlock.order.paid_at = timezone.now()
                unlock.order.save(update_fields=["status", "paid_at"])

            activated += 1

        self.message_user(
            request,
            f"Активовано: {activated}. Вже активних: {skipped}.",
            messages.SUCCESS,
        )

    @admin.action(description="↩️ Позначити як повернуто (refunded)")
    def action_refund(self, request, queryset):
        refunded = queryset.exclude(
            status=ProfileUnlock.Status.REFUNDED
        ).update(status=ProfileUnlock.Status.REFUNDED)
        self.message_user(
            request,
            f"Позначено як повернуто: {refunded}. "
            "Фактичне повернення коштів виконується вручну через Monobank.",
            messages.WARNING,
        )

    @admin.display(description="Покупець")
    def buyer_link(self, obj):
        return format_html(
            '<a href="/admin/user/user/{}/change/">{}</a>',
            obj.buyer_id, obj.buyer,
        )

    @admin.display(description="Замовлення")
    def order_link(self, obj):
        if not obj.order_id:
            return "—"
        return format_html(
            '<a href="/admin/user/paymentorder/{}/change/">{}</a>',
            obj.order_id,
            obj.order.comment_id if obj.order else obj.order_id,
        )

    @admin.display(description="Статус")
    def status_badge(self, obj):
        colors = {
            ProfileUnlock.Status.PENDING:  ("#F58A3D", "Очікує"),
            ProfileUnlock.Status.ACTIVE:   ("#3aaf6f", "Активне"),
            ProfileUnlock.Status.REFUNDED: ("#aaa",    "Повернуто"),
        }
        color, label = colors.get(obj.status, ("#aaa", obj.status))
        return format_html(
            '<span style="color:{}; font-weight:700;">{}</span>', color, label
        )
        
@admin.register(UnmatchedPayment)
class UnmatchedPaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "mono_id",
        "amount_uah",
        "description",
        "received_at",
        "note_preview",
    )
    search_fields = ("mono_id", "description", "note")
    ordering = ("-received_at",)
    list_per_page = 50
    readonly_fields = ("mono_id", "amount", "description", "received_at", "created_at")
    fieldsets = (
        ("Платіж", {
            "fields": ("mono_id", "amount", "description", "received_at", "created_at"),
        }),
        ("Нотатка адміна", {
            "fields": ("note",),
        }),
    )

    @admin.display(description="Сума")
    def amount_uah(self, obj):
        return f"{obj.amount / 100:.0f} грн"

    @admin.display(description="Нотатка")
    def note_preview(self, obj):
        if not obj.note:
            return "—"
        return (obj.note[:40] + "…") if len(obj.note) > 40 else obj.note