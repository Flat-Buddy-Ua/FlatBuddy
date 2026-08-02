#!/usr/bin/env python3
"""
Перевіряє, чи актуальний Monobank webhook URL, і перереєструє його,
якщо він злетів (пустий або відрізняється від очікуваного).

Налаштування — через змінні середовища (додай у /etc/environment,
systemd EnvironmentFile, або в сам crontab):

    MONOBANK_TOKEN      — персональний токен для api.monobank.ua
    MONOBANK_WEBHOOK_SECRET — той самий секрет, що і в Django (?token=...)
    MONOBANK_WEBHOOK_DOMAIN — напр. https://flatbuddyua.com
    TELEGRAM_BOT_TOKEN      — (опційно) для сповіщень
    TELEGRAM_CHAT_ID        — (опційно) для сповіщень

Виклик з cron:
    */30 * * * * /usr/bin/python3 /root/FlatBuddy/scripts/check_mono_webhook.py >> /var/log/mono_webhook_check.log 2>&1
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

API_BASE = "https://api.monobank.ua"

API_TOKEN = os.environ.get("MONOBANK_TOKEN")
WEBHOOK_SECRET = os.environ.get("MONOBANK_WEBHOOK_SECRET")
DOMAIN = os.environ.get("MONOBANK_WEBHOOK_DOMAIN", "https://flatbuddyua.com")
WEBHOOK_PATH = "/api/mono-webhook/"

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

EXPECTED_URL = f"{DOMAIN}{WEBHOOK_PATH}?token={WEBHOOK_SECRET}"


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[{ts}] {msg}", flush=True)


def notify(msg: str) -> None:
    """Шле сповіщення в Telegram, якщо налаштовано. Помилки не фатальні."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = json.dumps({"chat_id": TELEGRAM_CHAT_ID, "text": msg}).encode()
        req = urllib.request.Request(
            url, data=data, headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        log(f"⚠️  Не вдалось надіслати Telegram-сповіщення: {e}")


def get_client_info() -> dict:
    req = urllib.request.Request(
        f"{API_BASE}/personal/client-info",
        headers={"X-Token": API_TOKEN},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def set_webhook(url: str) -> dict:
    payload = json.dumps({"webHookUrl": url}).encode()
    req = urllib.request.Request(
        f"{API_BASE}/personal/webhook",
        data=payload,
        method="POST",
        headers={"X-Token": API_TOKEN, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def main() -> int:
    if not API_TOKEN or not WEBHOOK_SECRET:
        log("❌ Не задані MONOBANK_TOKEN або MONOBANK_WEBHOOK_SECRET. Виходжу.")
        return 1

    try:
        info = get_client_info()
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="ignore")
        log(f"❌ Помилка client-info: HTTP {e.code} — {body}")
        notify(f"⚠️ Monobank webhook check: помилка client-info (HTTP {e.code})")
        return 1
    except Exception as e:
        log(f"❌ Помилка client-info: {e}")
        notify(f"⚠️ Monobank webhook check: не вдалось звернутись до API ({e})")
        return 1

    current_url = info.get("webHookUrl", "")

    if current_url == EXPECTED_URL:
        log(f"✅ Webhook актуальний: {current_url}")
        return 0

    log(f"⚠️ Webhook НЕ збігається. Поточний: '{current_url}' | Очікуваний: '{EXPECTED_URL}'")

    try:
        result = set_webhook(EXPECTED_URL)
        log(f"🔧 Webhook перереєстровано: {result}")
        notify(
            "🔧 Monobank webhook злетів і був автоматично перереєстрований.\n"
            f"Було: {current_url or '(порожньо)'}\n"
            f"Стало: {EXPECTED_URL}"
        )
        return 0
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="ignore")
        log(f"❌ Не вдалось перереєструвати webhook: HTTP {e.code} — {body}")
        notify(f"❌ Monobank webhook злетів, АВТОВІДНОВЛЕННЯ НЕ ВДАЛОСЬ: HTTP {e.code} — {body}")
        return 1
    except Exception as e:
        log(f"❌ Не вдалось перереєструвати webhook: {e}")
        notify(f"❌ Monobank webhook злетів, АВТОВІДНОВЛЕННЯ НЕ ВДАЛОСЬ: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())