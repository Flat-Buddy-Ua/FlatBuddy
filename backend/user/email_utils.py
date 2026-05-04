import resend
from django.conf import settings

def send_magic_link(user, token):
    resend.api_key = settings.RESEND_API_KEY
    link = f"{settings.FRONTEND_URL}/verify/{token}"

    resend.Emails.send({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [user.email],
        "subject": "Підтвердження реєстрації у FlatBuddy",
        "text": f"""Привіт, {user.first_name}!

Перейди за посиланням, щоб підтвердити реєстрацію: {link}

Посилання дійсне 15 хвилин і може бути використане лише один раз.

Якщо ти не реєструвався у FlatBuddy — просто проігноруй цей лист.

З повагою,
команда FlatBuddy""",
    })