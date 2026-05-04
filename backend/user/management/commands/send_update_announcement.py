from django.core.management.base import BaseCommand
from user.models import User
from user.email_utils import send_announcement


class Command(BaseCommand):
    help = 'Send HTML announcement email to all verified users'

    def handle(self, *args, **options):
        users = User.objects.filter(is_active=True)
        total = users.count()

        if total == 0:
            self.stdout.write(self.style.WARNING('No verified users found'))
            return

        self.stdout.write(f'Sending to {total} users...')

        for user in users:
            try:
                send_announcement(user)
                self.stdout.write(self.style.SUCCESS(f'Sent: {user.email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error {user.email}: {e}'))

        self.stdout.write(self.style.SUCCESS('Done!'))
