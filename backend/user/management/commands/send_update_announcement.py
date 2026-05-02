from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from user.models import User

class Command(BaseCommand):
    help='Sending email announcement'

    def handle(self, *args, **options):
        subject='Update announcement!'
        message="""bla-bla-bla"""
        
        users = User.objects.filter(is_active=True).values_list('email', flat=True)
        total = len(users)

        if total == 0:
            self.stdout.write(self.style.WARNING('No verified users found'))
            return

        failed = 0
        self.stdout.write(f'Sending to {total} users...')

        for email in users:
            try:
                send_mail(subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
                )
                self.stdout.write(self.style.SUCCESS(f'Email sent: {email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error sending to: {email}: \nError: {e}'))

        self.stdout.write(self.style.SUCCESS(
            f'Done!'
        ))
