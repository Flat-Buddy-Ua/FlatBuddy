from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from user.models import User

class Command(BaseCommand):
    link = f"{settings.FRONTEND_URL}"
    help='Sending email announcement'

    def handle(self, *args, **options):
        subject='Готові до знайомства з ідеальним співмешканцем?'
        message=f"""Привіт, на зв’язку Flat Buddy!

Раді повідомити, що тепер ви можете заповнити профіль для пошуку свого ✨ідеального сусіда✨
08.05 ми вже запускаємо Matching, тому опишіть себе якнайкраще!!
🤫 Перші 100 профілів = необмежена кількість потенційних співмешканців БЕЗКОШТОВНО!

Переходь за посиланням та встигни заповнити профіль: {self.link}
Твій,
Flat Buddy
"""
        
        users = User.objects.filter(is_active=True).values_list('email', flat=True)
        total = len(users)

        if total == 0:
            self.stdout.write(self.style.WARNING('No verified users found'))
            return

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
