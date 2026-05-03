from django.core.mail import send_mail
from django.conf import settings

def send_magic_link(user, token):
    link = f"{settings.FRONTEND_URL}/verify/{token}"
    send_mail(
        subject='Підтвердження реєстрації у FlatBuddy',
        message=f"""Привіт, {user.first_name}!

Перейди за посиланням, щоб підтвердити реєстрацію: {link}

Посилання дійсне 15 хвилин і може бути використане лише один раз.

Якщо ти не реєструвався у FlatBuddy — просто проігноруй цей лист.

З повагою,
команда FlatBuddy
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email]
    )