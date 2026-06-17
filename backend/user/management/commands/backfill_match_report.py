from django.core.management.base import BaseCommand
from user.models import UserMatch, MatchReport

class Command(BaseCommand):
    help = 'Заповнює MatchReport для всіх існуючих UserMatch'

    def handle(self, *args, **kwargs):
        matches = UserMatch.objects.select_related('user_1', 'user_2').all()
        created_count = 0

        for m in matches:
            _, created = MatchReport.objects.update_or_create(
                user_match=m,
                defaults={
                    'user_1_id_ref':     m.user_1_id,
                    'user_1_first_name': m.user_1.first_name,
                    'user_1_last_name':  m.user_1.last_name,
                    'user_2_id_ref':     m.user_2_id,
                    'user_2_first_name': m.user_2.first_name,
                    'user_2_last_name':  m.user_2.last_name,
                    'compatibility_score': m.compatibility_score,
                    'matched_at':        m.matched_at,
                }
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Готово! Створено {created_count} записів із {matches.count()} матчів.')
        )