import requests
from django.conf import settings

def send_magic_link(user, token):
    link = f"{settings.FRONTEND_URL}/verify/{token}"

    requests.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {settings.RESEND_API_KEY}',
            'Content-Type': 'application/json; charset=utf-8',
        },
        json={
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [user.email],
            "subject": "Підтвердження реєстрації у FlatBuddy",
            "text": (
                f"Привіт, {user.first_name}!\n\n"
                f"Перейди за посиланням, щоб підтвердити реєстрацію: {link}\n\n"
                "Посилання дійсне 15 хвилин і може бути використане лише один раз.\n\n"
                "Якщо ти не реєструвався у FlatBuddy — просто проігноруй цей лист.\n\n"
                "З повагою,\nкоманда FlatBuddy"
            ),
        }
    )