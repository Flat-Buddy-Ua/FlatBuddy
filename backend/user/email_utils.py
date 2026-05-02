from django.core.mail import send_mail
from django.conf import settings

def send_magic_link(user, token):
    link = f"{settings.FRONTEND_URL}/verify/{token}"
    send_mail(
        subject='Confirm your registration!',
        message=f"""Hi, {user.first_name}!

        Follow this link to confirm your registration: {link}

        The link is valid for 15 minutes and can be used only once.

        If you did not request this link, please ignore this email.

        Sincerely,
        The FlatBuddy Team
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email]
    )