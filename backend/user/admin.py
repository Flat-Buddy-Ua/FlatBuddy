from django.contrib import admin
from .models import (
    User, UserProfile, UserHousing, UserPhoto,
    UserPriority, MatchResult, SeenProfile,
)

admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(UserHousing)
admin.site.register(UserPhoto)


@admin.register(UserPriority)
class UserPriorityAdmin(admin.ModelAdmin):
    list_display    = ('user', 'fields')
    search_fields   = ('user__email',)
    raw_id_fields   = ('user',)
    list_select_related = ('user',)


@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_1', 'user_2',
        'total_score', 'status', 'hard_filter_passed', 'is_stale',
        'updated_at',
    )
    list_filter      = ('status', 'is_stale', 'hard_filter_passed', 'skip_reason')
    search_fields    = ('user_1__email', 'user_2__email')
    raw_id_fields    = ('user_1', 'user_2')
    ordering         = ('-total_score',)
    date_hierarchy   = 'updated_at'
    list_per_page    = 50
    list_select_related = ('user_1', 'user_2')
    readonly_fields  = (
        'total_score',
        'score_vibe', 'score_hobbies', 'score_cleanliness',
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
                'score_vibe', 'score_hobbies', 'score_cleanliness',
                'score_smoking', 'score_partying', 'score_political',
                'score_personality', 'score_schedule',
            ),
        }),
        ('Службове', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    actions = ('mark_stale', 'mark_fresh')

    @admin.action(description="Позначити обрані матчі як stale")
    def mark_stale(self, request, queryset):
        updated = queryset.update(is_stale=True)
        self.message_user(request, f"Позначено stale: {updated}")

    @admin.action(description="Зняти прапорець stale з обраних матчів")
    def mark_fresh(self, request, queryset):
        updated = queryset.update(is_stale=False)
        self.message_user(request, f"Знято stale: {updated}")


@admin.register(SeenProfile)
class SeenProfileAdmin(admin.ModelAdmin):
    list_display    = ('id', 'user', 'match', 'seen_at')
    list_filter     = ('seen_at',)
    search_fields   = ('user__email',)
    raw_id_fields   = ('user', 'match')
    date_hierarchy  = 'seen_at'
    ordering        = ('-seen_at',)
    list_per_page   = 50
    list_select_related = ('user', 'match')
    readonly_fields = ('seen_at',)
