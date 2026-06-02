import hashlib
import hmac
import json

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from user.models import MatchResult, PaymentOrder, ProfileUnlock, SeenProfile
from user.payment.payment import UNLOCK_PRICE

User = get_user_model()


class FlatBuddyPaymentAndFeedTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="me@lpnu.ua",
            phone_number="+380970000001",
            password="password123",
            country=1,
            city="Lviv",
            gender=1,
            birthdate="2000-01-01",
            is_active=True,
            package=User.Package.FREE,
        )
        self.other_user_1 = User.objects.create_user(
            email="match1@lpnu.ua",
            phone_number="+380970000002",
            password="password123",
            country=1,
            city="Lviv",
            gender=2,
            birthdate="2000-01-01",
            is_active=True,
        )
        self.other_user_2 = User.objects.create_user(
            email="match2@lpnu.ua",
            phone_number="+380970000003",
            password="password123",
            country=1,
            city="Lviv",
            gender=2,
            birthdate="2000-01-01",
            is_active=True,
        )

        self.low_match = MatchResult.objects.create(
            user_1=self.user,
            user_2=self.other_user_1,
            total_score=45.5,
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
        )
        self.high_match = MatchResult.objects.create(
            user_1=self.user,
            user_2=self.other_user_2,
            total_score=85.0,
            status=MatchResult.Status.DONE,
            hard_filter_passed=True,
        )

        self.client.force_authenticate(user=self.user)

    def test_get_feed_structure_does_not_expose_scores(self):
        response = self.client.get(reverse("feed"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["free"]), 1)
        self.assertEqual(response.data["free"][0]["match_id"], self.low_match.id)
        self.assertNotIn("total_score", response.data["free"][0])

        self.assertIsNotNone(response.data["teaser"])
        self.assertEqual(response.data["teaser"]["match_id"], self.high_match.id)
        self.assertEqual(response.data["teaser"]["price_uah"], 50)
        self.assertNotIn("total_score", response.data["teaser"])

    def test_initiate_unlock_creates_pending_order(self):
        response = self.client.post(
            reverse("payment-unlock"),
            {"match_id": self.high_match.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("comment_id", response.data)
        self.assertEqual(response.data["amount"], 50.0)

        order = PaymentOrder.objects.get(comment_id=response.data["comment_id"])
        self.assertEqual(order.status, PaymentOrder.Status.PENDING)
        self.assertEqual(order.amount_expected, UNLOCK_PRICE)
        self.assertEqual(order.package, User.Package.FREE)

        unlock = ProfileUnlock.objects.get(order=order)
        self.assertEqual(unlock.status, ProfileUnlock.Status.PENDING)

    def test_monobank_webhook_activation(self):
        order = PaymentOrder.objects.create(
            user=self.user,
            comment_id="XYZ12345",
            match=self.high_match,
            type=PaymentOrder.Type.PROFILE_UNLOCK,
            amount_expected=UNLOCK_PRICE,
            package=self.user.package,
        )
        ProfileUnlock.objects.create(
            buyer=self.user,
            match=self.high_match,
            order=order,
            status=ProfileUnlock.Status.PENDING,
        )

        payload = {
            "data": {
                "statementItem": {
                    "amount": UNLOCK_PRICE,
                    "comment": "XYZ12345",
                }
            }
        }
        body_bytes = json.dumps(payload).encode("utf-8")

        with self.settings(MONOBANK_WEBHOOK_SECRET="test_secret"):
            signature = hmac.new(
                b"test_secret",
                body_bytes,
                hashlib.sha256,
            ).hexdigest()

            response = self.client.post(
                reverse("mono-webhook"),
                data=body_bytes,
                content_type="application/json",
                HTTP_X_SIGN=signature,
            )

        self.assertEqual(response.status_code, 200)

        order.refresh_from_db()
        self.assertEqual(order.status, PaymentOrder.Status.PAID)

        unlock = ProfileUnlock.objects.get(order=order)
        self.assertEqual(unlock.status, ProfileUnlock.Status.ACTIVE)
        self.assertIsNotNone(unlock.unlocked_at)

    def test_fomo_does_not_expose_hidden_score_or_count(self):
        for i in range(5):
            SeenProfile.objects.create(
                user=self.user,
                match=MatchResult.objects.create(
                    user_1=self.user,
                    user_2=self.other_user_1,
                    total_score=40 + i,
                    status=MatchResult.Status.DONE,
                    hard_filter_passed=True,
                ),
            )

        response = self.client.get(reverse("feed-fomo"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["hidden_count"], 0)
        self.assertTrue(response.data["has_hidden_profiles"])
        self.assertIsNone(response.data["best_score"])
        self.assertEqual(response.data["unlock_match_id"], self.high_match.id)

    def test_free_user_cannot_open_teaser_detail(self):
        response = self.client.get(
            reverse("matches-detail-by-user", kwargs={"user_id": self.other_user_2.id})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(
            SeenProfile.objects.filter(user=self.user, match=self.high_match).exists()
        )
