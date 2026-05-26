from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
import hmac
import hashlib
import json

from user.models import MatchResult, PaymentOrder, ProfileUnlock, SeenProfile
from user.payment.payment import UNLOCK_PRICE

User = get_user_model()

class FlatBuddyPaymentAndFeedTests(APITestCase):

    def setUp(self):
        # Створення користувачів
        self.user = User.objects.create_user(
            email="me@lpnu.ua", phone_number="+380970000001", password="password123",
            country=1, city="Lviv", gender=1, birthdate="2000-01-01", is_active=True
        )
        self.other_user_1 = User.objects.create_user(
            email="match1@lpnu.ua", phone_number="+380970000002", password="password123",
            country=1, city="Lviv", gender=2, birthdate="2000-01-01", is_active=True
        )
        self.other_user_2 = User.objects.create_user(
            email="match2@lpnu.ua", phone_number="+380970000003", password="password123",
            country=1, city="Lviv", gender=2, birthdate="2000-01-01", is_active=True
        )

        # Створення матчів (один слабкий для free pool, один сильний для teaser)
        self.low_match = MatchResult.objects.create(
            user_1=self.user, user_2=self.other_user_1,
            total_score=45.5, status=MatchResult.Status.DONE, hard_filter_passed=True
        )
        self.high_match = MatchResult.objects.create(
            user_1=self.user, user_2=self.other_user_2,
            total_score=85.0, status=MatchResult.Status.DONE, hard_filter_passed=True
        )
        
        self.client.force_authenticate(user=self.user)

    def test_get_feed_structure(self):
        """Перевірка розділення анкет на безкоштовні та тизер"""
        url = reverse('feed-view') # Переконайся, що назва URL збігається в urls.py
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['free']), 1)
        self.assertEqual(response.data['free'][0]['match_id'], self.low_match.id)
        
        # Тизер заблюрений, повертає тільки базові метадані та ціну
        self.assertIsNotNone(response.data['teaser'])
        self.assertEqual(response.data['teaser']['match_id'], self.high_match.id)
        self.assertEqual(response.data['teaser']['price_uah'], 50)

    def test_initiate_unlock_creates_pending_order(self):
        """Ініціація оплати створює PaymentOrder та ProfileUnlock у статусі PENDING"""
        url = reverse('initiate-unlock')
        data = {"match_id": self.high_match.id}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('comment_id', response.data)
        self.assertEqual(response.data['amount'], 50.0)

        # Перевірка в базі
        order = PaymentOrder.objects.get(comment_id=response.data['comment_id'])
        self.assertEqual(order.status, PaymentOrder.Status.PENDING)
        self.assertEqual(order.amount_expected, UNLOCK_PRICE)
        
        unlock = ProfileUnlock.objects.get(order=order)
        self.assertEqual(unlock.status, ProfileUnlock.Status.PENDING)

    def test_monobank_webhook_activation(self):
        """Емуляція успішного колбеку від Monobank та активація анкети"""
        # Спочатку створюємо замовлення
        order = PaymentOrder.objects.create(
            user=self.user, comment_id="XYZ12345", match=self.high_match,
            type=PaymentOrder.Type.PROFILE_UNLOCK, amount_expected=UNLOCK_PRICE
        )
        ProfileUnlock.objects.create(
            buyer=self.user, match=self.high_match, order=order, status=ProfileUnlock.Status.PENDING
        )

        # Формуємо payload для вебхука
        payload = {
            "data": {
                "statementItem": {
                    "amount": UNLOCK_PRICE, # Списується позитивне число (через abs у коді)
                    "comment": "XYZ12345"
                }
            }
        }
        body_bytes = json.dumps(payload).encode('utf-8')
        
        # Підпис (ключаємо таємний секрет, наприклад 'test_secret')
        with self.settings(MONOBANK_WEBHOOK_SECRET='test_secret'):
            signature = hmac.new(b'test_secret', body_bytes, hashlib.sha256).hexdigest()
            
            url = reverse('mono-webhook')
            response = self.client.post(
                url, data=body_bytes, content_type='application/json',
                HTTP_X_SIGN=signature
            )
            
        self.assertEqual(response.status_code, 200)
        
        # Перевіряємо чи статус змінився на PAID та ACTIVE
        order.refresh_from_db()
        self.assertEqual(order.status, PaymentOrder.Status.PAID)
        
        unlock = ProfileUnlock.objects.get(order=order)
        self.assertEqual(unlock.status, ProfileUnlock.Status.ACTIVE)
        self.assertIsNotNone(unlock.unlocked_at)

    def test_fomo_metrics(self):
        """Перевірка правильності підрахунку прихованих анкет з високим score"""
        url = reverse('fomo-view')
        # Не передаємо seen параметрів
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['hidden_count'], 1) # Тільки high_match (score >= 70)
        self.assertEqual(response.data['best_score'], 85.0)