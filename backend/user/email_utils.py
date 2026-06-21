import requests
from django.conf import settings


def _send(to_email, subject, html):
    requests.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {settings.RESEND_API_KEY}',
            'Content-Type': 'application/json; charset=utf-8',
        },
        json={
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html,
        }
    )


def send_magic_link(user, token):
    link = f"{settings.FRONTEND_URL}/verify/{token}"

    html = f"""<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:#F6DDD4;padding:32px 40px;text-align:center;">
            <img src="{settings.FRONTEND_URL}/static/backend/logo.png" alt="FlatBuddy" height="48" style="display:block;margin:0 auto;"/>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px;">
            <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#1a1a1a;">Привіт, {user.first_name}! 👋</p>
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
              Для завершення реєстрації у <strong>FlatBuddy</strong> перейди за посиланням нижче.<br/>
              Посилання дійсне <strong>15 хвилин</strong> і може бути використане лише один раз.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1a1a1a;">
                  <a href="{link}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Підтвердити реєстрацію →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 36px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
              Твій, <strong style="color:#555;">Flat Buddy</strong><br/>
              Якщо ти не реєструвався у FlatBuddy — просто проігноруй цей лист.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    _send(user.email, "Підтвердження реєстрації у FlatBuddy", html)

def send_reset_password_email(user, token):
    link = f"{settings.FRONTEND_URL}/reset-password/{token}"

    html = f"""
    <p>Вітаємо, {user.first_name}!</p>
    
    <p>Ми щойно отримали запит на зміну вашого пароля. Якщо ви не відправляли такий запит, проігноруйте це повідомлення. Проте, якщо ви не пам'ятаєте старий пароль, натисніть на посилання нижче, щоб створити новий пароль.</p>
    
    <p><a href="{link}">Зміна паролю</a></p>
    
    <p>Примітка: посилання дійсне протягом 24 годин з моменту відправлення цього листа.
    Твій, Flat Buddy</p>
    """

    _send(user.email, "Зміна паролю FlatBuddy", html)

def send_announcement(user):
    link = settings.FRONTEND_URL

    html = f"""<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:#F6DDD4;padding:32px 40px;text-align:center;">
            <img src="{settings.FRONTEND_URL}/static/backend/logo.png" alt="FlatBuddy" height="48" style="display:block;margin:0 auto;"/>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px;">
            <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#1a1a1a;">Привіт, {user.first_name}! 👋</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
              На зв'язку команда <strong>Flat Buddy</strong>! Раді повідомити — тепер ти можеш заповнити профіль та знайти свого ✨ ідеального сусіда ✨
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF5F0;border-left:4px solid #F6DDD4;margin:20px 0;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.6;">
                    📅 <strong>08.05</strong> ми запускаємо <strong>Matching</strong> — опиши себе якнайкраще!<br/>
                    🤫 Перші <strong>100 профілів</strong> = необмежена кількість потенційних співмешканців <strong>БЕЗКОШТОВНО!</strong>
                  </p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
              Встигни заповнити профіль до запуску — це займе лише кілька хвилин.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1a1a1a;">
                  <a href="{link}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Заповнити профіль →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 36px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
              Твій, <strong style="color:#555;">Flat Buddy</strong><br/>
              Якщо ти не реєструвався — просто проігноруй цей лист.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    _send(user.email, "Готові до знайомства з ідеальним співмешканцем?", html)


def send_new_like_email(to_user, from_user):
    link = settings.FRONTEND_URL
    html = f"<p>Привіт, {to_user.first_name}!</p><p>Тобою зацікавився користувач {from_user.first_name} {from_user.last_name}. Перейдіть, щоб переглянути профіль.</p>"
    _send(to_user.email, "Вас лайкнули!", html)


def send_new_match_email(to_user, from_user):
    link = settings.FRONTEND_URL
    html = f"<p>Вітаємо, {to_user.first_name}!</p><p>У Вас новий метч з {from_user.first_name} {from_user.last_name} 🎉. Перейдіть, щоб переглянути.</p>"
    _send(to_user.email, "У Вас новий метч!", html)
