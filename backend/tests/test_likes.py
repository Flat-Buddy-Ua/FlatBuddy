from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from user.models import User, UserLike, UserMatch
from user.matching.like_service import (
    handle_like, handle_unlike,
    get_incoming_likes, get_outgoing_likes, get_my_matches,
)

def make_user(email, **kwargs):
    defaults = dict(
        password='testpass',
        first_name='Тест',
        last_name='Юзер',
        country=1,
        city='Lviv',
        gender=1,
        birthdate='2000-01-01',
        phone_number=email.replace('@', '').replace('.', ''),
        is_active=True,
    )
    defaults.update(kwargs)
    return User.objects.create_user(email=email, **defaults)

class LikeServiceTest(TestCase):

    def setUp(self):
        self.alice = make_user('alice@test.com', phone_number='111111111')
        self.bob   = make_user('bob@test.com',   phone_number='222222222')
        self.carol = make_user('carol@test.com', phone_number='333333333')

    def test_like_creates_userlike(self):
        result = handle_like(self.alice, self.bob)
        self.assertEqual(result['status'], 'liked')
        self.assertIsNone(result['match_id'])
        self.assertTrue(UserLike.objects.filter(
            from_user=self.alice, to_user=self.bob
        ).exists())

    def test_like_twice_returns_already_liked(self):
        handle_like(self.alice, self.bob)
        result = handle_like(self.alice, self.bob)
        self.assertEqual(result['status'], 'already_liked')
        self.assertEqual(UserLike.objects.filter(
            from_user=self.alice, to_user=self.bob
        ).count(), 1)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_mutual_like_creates_match(self, mock_notify):
        handle_like(self.alice, self.bob)
        result = handle_like(self.bob, self.alice)

        self.assertEqual(result['status'], 'match')
        self.assertIsNotNone(result['match_id'])

        match = UserMatch.objects.get(id=result['match_id'])
        self.assertTrue(match.is_active)
        self.assertLess(match.user_1_id, match.user_2_id)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_mutual_like_calls_notify(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob, self.alice)

        mock_notify.assert_called_once_with(self.bob.id, self.alice.id)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_one_sided_like_no_match(self, mock_notify):
        handle_like(self.alice, self.bob)
        mock_notify.assert_not_called()
        self.assertFalse(UserMatch.objects.exists())

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_unlike_removes_like(self, mock_notify):
        handle_like(self.alice, self.bob)
        result = handle_unlike(self.alice, self.bob)

        self.assertEqual(result['status'], 'unliked')
        self.assertFalse(UserLike.objects.filter(
            from_user=self.alice, to_user=self.bob
        ).exists())

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_unlike_deactivates_match(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob, self.alice)

        match = UserMatch.objects.get(user_1_id=min(self.alice.id, self.bob.id))
        self.assertTrue(match.is_active)

        handle_unlike(self.alice, self.bob)

        match.refresh_from_db()
        self.assertFalse(match.is_active)

    def test_unlike_nonexistent_returns_not_found(self):
        result = handle_unlike(self.alice, self.bob)
        self.assertEqual(result['status'], 'not_found')

    def test_incoming_likes(self):
        handle_like(self.bob,   self.alice)
        handle_like(self.carol, self.alice)

        incoming = list(get_incoming_likes(self.alice))
        from_ids = [l.from_user_id for l in incoming]
        self.assertIn(self.bob.id,   from_ids)
        self.assertIn(self.carol.id, from_ids)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_incoming_excludes_mutual(self, mock_notify):
        handle_like(self.bob,   self.alice)
        handle_like(self.alice, self.bob)  

        incoming = list(get_incoming_likes(self.alice))
        self.assertEqual(len(incoming), 0)

    def test_outgoing_likes(self):
        handle_like(self.alice, self.bob)
        handle_like(self.alice, self.carol)

        outgoing = list(get_outgoing_likes(self.alice))
        to_ids = [l.to_user_id for l in outgoing]
        self.assertIn(self.bob.id,   to_ids)
        self.assertIn(self.carol.id, to_ids)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_outgoing_excludes_mutual(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob,   self.alice)

        outgoing = list(get_outgoing_likes(self.alice))
        self.assertEqual(len(outgoing), 0)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_get_my_matches(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob,   self.alice)

        matches = list(get_my_matches(self.alice))
        self.assertEqual(len(matches), 1)
        self.assertTrue(matches[0].is_active)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_get_my_matches_excludes_inactive(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob,   self.alice)
        handle_unlike(self.alice, self.bob) 

        matches = list(get_my_matches(self.alice))
        self.assertEqual(len(matches), 0)


    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_rematch_after_unlike(self, mock_notify):
        handle_like(self.alice, self.bob)
        handle_like(self.bob,   self.alice)
        handle_unlike(self.alice, self.bob)
        handle_like(self.alice, self.bob)
        match = UserMatch.objects.get(
            user_1_id=min(self.alice.id, self.bob.id),
            user_2_id=max(self.alice.id, self.bob.id),
        )
        self.assertTrue(match.is_active)

class LikeAPITest(TestCase):

    def setUp(self):
        self.alice = make_user('alice@api.com', phone_number='444444444')
        self.bob   = make_user('bob@api.com',   phone_number='555555555')

        self.client_alice = APIClient()
        self.client_alice.force_authenticate(user=self.alice)

        self.client_bob = APIClient()
        self.client_bob.force_authenticate(user=self.bob)

    def test_post_like_success(self):
        resp = self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'liked')

    def test_post_like_self_returns_400(self):
        resp = self.client_alice.post('/api/likes/', {'to_user_id': self.alice.id})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_like_inactive_user_returns_400(self):
        inactive = make_user('inactive@test.com', phone_number='666666666', is_active=False)
        resp = self.client_alice.post('/api/likes/', {'to_user_id': inactive.id})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_like_unauthenticated_returns_401(self):
        resp = self.client.post('/api/likes/', {'to_user_id': self.bob.id})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_post_mutual_like_returns_match(self, mock_notify):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        resp = self.client_bob.post('/api/likes/', {'to_user_id': self.alice.id})

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'match')
        self.assertIn('match_id', resp.data)

    def test_delete_like_success(self):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        resp = self.client_alice.delete(f'/api/likes/{self.bob.id}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'unliked')

    def test_delete_nonexistent_like_returns_404(self):
        resp = self.client_alice.delete(f'/api/likes/{self.bob.id}/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_incoming_likes(self):
        self.client_bob.post('/api/likes/', {'to_user_id': self.alice.id})
        resp = self.client_alice.get('/api/likes/incoming/')

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['from_user']['id'], self.bob.id)

    def test_get_incoming_empty_when_none(self):
        resp = self.client_alice.get('/api/likes/incoming/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [])


    def test_get_outgoing_likes(self):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        resp = self.client_alice.get('/api/likes/outgoing/')

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['to_user']['id'], self.bob.id)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_get_matches(self, mock_notify):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        self.client_bob.post('/api/likes/',   {'to_user_id': self.alice.id})

        resp = self.client_alice.get('/api/matches/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['other_user']['id'], self.bob.id)

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_get_matches_empty_after_unlike(self, mock_notify):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        self.client_bob.post('/api/likes/',   {'to_user_id': self.alice.id})
        self.client_alice.delete(f'/api/likes/{self.bob.id}/')

        resp = self.client_alice.get('/api/matches/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [])

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_notify_called_on_match(self, mock_notify):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        self.client_bob.post('/api/likes/',   {'to_user_id': self.alice.id})
        mock_notify.assert_called_once()

    @patch('user.matching.tasks.notify_mutual_match.delay')
    def test_notify_not_called_on_one_sided(self, mock_notify):
        self.client_alice.post('/api/likes/', {'to_user_id': self.bob.id})
        mock_notify.assert_not_called()