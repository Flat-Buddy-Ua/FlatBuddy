from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from user.models import User
from django.core.cache import cache
from unittest.mock import patch
import secrets
from datetime import date
from user.constants.rate_limits import PASSWORD_RESET_TOKEN_TTL

class PasswordResetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.active_user = User.objects.create_user(
            email='active@test.com',
            phone_number='+380501234567',
            password='oldpassword123',
            first_name='Ivan',
            last_name='Ivanov',
            country=1,
            city=1,
            gender=1,
            birthdate=date(2000, 1, 1),
            is_active=True
        )
        self.inactive_user = User.objects.create_user(
            email='inactive@test.com',
            phone_number='+380501234568',
            password='oldpassword123',
            first_name='Petro',
            last_name='Petrov',
            country=1,
            city=1,
            gender=1,
            birthdate=date(2000, 1, 1),
            is_active=False
        )
        self.request_url = reverse('request-reset-password')
    def tearDown(self):
        cache.clear()

    @patch('user.views.ResetPasswordView.send_reset_password_email')
    def test_request_flow_correct_email(self, mock_send_email):
        response = self.client.post(self.request_url, {'email': self.active_user.email})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], f'Link sent to email {self.active_user.email}')
        
        mock_send_email.assert_called_once()
        args, kwargs = mock_send_email.call_args
        self.assertEqual(kwargs['user'], self.active_user)
        self.assertIn('token', kwargs)

        token = kwargs['token']
        self.assertEqual(cache.get(f"reset_password_token:{token}"), self.active_user.id)

    @patch('user.views.ResetPasswordView.send_reset_password_email')
    def test_request_flow_wrong_email(self, mock_send_email):
        response = self.client.post(self.request_url, {'email': 'wrong@test.com'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], 'Link sent to email wrong@test.com')
        mock_send_email.assert_not_called()

    @patch('user.views.ResetPasswordView.send_reset_password_email')
    def test_request_flow_inactive_user(self, mock_send_email):
        response = self.client.post(self.request_url, {'email': self.inactive_user.email})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], f'Link sent to email {self.inactive_user.email}')
        mock_send_email.assert_not_called()

    def test_verify_flow_valid_token(self):
        token = secrets.token_urlsafe(32)
        cache.set(f"reset_password_token:{token}", self.active_user.id, timeout=PASSWORD_RESET_TOKEN_TTL)
        
        url = reverse('verify-reset-token', kwargs={'token': token})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], 'Token verified')

    def test_verify_flow_invalid_token(self):
        url = reverse('verify-reset-token', kwargs={'token': 'invalid-token-123'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'Invalid or expired link')

    def test_confirm_flow_valid_token_matching_passwords(self):
        token = secrets.token_urlsafe(32)
        cache.set(f"reset_password_token:{token}", self.active_user.id, timeout=PASSWORD_RESET_TOKEN_TTL)
        
        data = {
            'password': 'NewPassword123!',
            'repeat_password': 'NewPassword123!'
        }
        
        url = reverse('confirm-password', kwargs={'token': token})
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['detail'], 'Password reset successfully')
        

        self.active_user.refresh_from_db()
        self.assertTrue(self.active_user.check_password('NewPassword123!'))
        

        self.assertIsNone(cache.get(f"reset_password_token:{token}"))

    def test_confirm_flow_mismatched_passwords(self):
        token = secrets.token_urlsafe(32)
        cache.set(f"reset_password_token:{token}", self.active_user.id, timeout=PASSWORD_RESET_TOKEN_TTL)
        
        data = {
            'password': 'NewPassword123!',
            'repeat_password': 'DifferentPassword123!'
        }
        
        url = reverse('confirm-password', kwargs={'token': token})
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('non_field_errors', response.data)
        
        self.assertIsNotNone(cache.get(f"reset_password_token:{token}"))

    def test_confirm_flow_expired_token(self):
        url = reverse('confirm-password', kwargs={'token': 'expired-token'})
        data = {
            'password': 'NewPassword123!',
            'repeat_password': 'NewPassword123!'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'Invalid or expired link')
