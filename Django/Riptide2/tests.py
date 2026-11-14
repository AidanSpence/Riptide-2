from datetime import timedelta
from unittest.mock import patch, MagicMock

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase, RequestFactory, override_settings
from django.urls import resolve
from django.utils import timezone
from django.http import JsonResponse
from rest_framework.test import APIClient

from .middleware import CloudFrontOriginMiddleware
from .models import UserChat, ChatMessage, Playlist, SpotifyOAuthState, GenerationBudget
from .services.spotify_client import parse_track
from .services.ai_response import playlist_with_message


class DeploymentUnitTests(SimpleTestCase):
    def test_health_without_database_or_secret(self):
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})

    @override_settings(DEBUG=False, CLOUDFRONT_ORIGIN_SECRET='test-origin')
    def test_origin_rejects_missing_or_incorrect_secret(self):
        handler = CloudFrontOriginMiddleware(lambda request: JsonResponse({'secure': request.is_secure()}))
        for supplied in ('', 'wrong'):
            request = RequestFactory().get('/api/me/', HTTP_X_RIPTIDE_ORIGIN=supplied)
            self.assertEqual(handler(request).status_code, 403)
        request = RequestFactory().get('/api/me/', HTTP_X_RIPTIDE_ORIGIN='test-origin')
        self.assertEqual(handler(request).content, b'{"secure": true}')

    def test_export_route_passes_playlist_id(self):
        self.assertEqual(resolve('/api/spotify/export/12/').kwargs, {'playlist_id': 12})

    def test_spotify_track_can_be_formatted_for_ai(self):
        track = parse_track({'id': 'track', 'name': 'Song', 'artists': [{'name': 'Artist'}]})
        original = [{'role': 'user', 'content': 'make a playlist'}]
        result = playlist_with_message(original, [track])
        self.assertIn('Song - Artist', result[0]['content'])
        self.assertEqual(original[0]['content'], 'make a playlist')

    @patch('boto3.client')
    @patch.dict('os.environ', {'BEDROCK_MODEL_ID': 'us.deepseek.r1-v1:0'})
    def test_bedrock_ignores_reasoning_and_closes_stream(self, client):
        from .services.providers import BedrockProvider
        stream = MagicMock()
        stream.__iter__.return_value = iter([
            {'contentBlockDelta': {'delta': {'reasoningContent': {'text': 'private reasoning'}}}},
            {'contentBlockDelta': {'delta': {'text': '{"ok":true}'}}},
            {'messageStop': {'stopReason': 'end_turn'}},
        ])
        client.return_value.converse_stream.return_value = {'stream': stream}
        self.assertEqual(''.join(BedrockProvider().stream([{'role': 'user', 'content': 'test'}])), '{"ok":true}')
        stream.close.assert_called_once()

    @patch('boto3.client')
    @patch.dict('os.environ', {'BEDROCK_MODEL_ID': 'us.deepseek.r1-v1:0'})
    def test_bedrock_truncation_is_an_error(self, client):
        from .services.providers import BedrockProvider
        stream = MagicMock()
        stream.__iter__.return_value = iter([{'messageStop': {'stopReason': 'max_tokens'}}])
        client.return_value.converse_stream.return_value = {'stream': stream}
        with self.assertRaises(ValueError):
            list(BedrockProvider().stream([{'role': 'user', 'content': 'test'}]))
        stream.close.assert_called_once()


class AccountAndChatTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='owner', password='a-long-test-password')
        self.other = get_user_model().objects.create_user(username='other', password='another-test-password')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.chat = UserChat.objects.create(user=self.user, name='Test chat')

    def test_signup_login_and_refresh(self):
        client = APIClient()
        response = client.post('/api/signup/', {'username': 'new-user', 'password': 'strong-test-password-472'}, format='json')
        self.assertEqual(response.status_code, 201)
        response = client.post('/api/login/', {'username': 'new-user', 'password': 'strong-test-password-472'}, format='json')
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/token/refresh/', {'refresh': response.data['refresh']}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

    def test_cannot_read_another_users_chat(self):
        chat = UserChat.objects.create(user=self.other, name='Private')
        self.assertEqual(self.client.get(f'/api/chats/{chat.pk}/').status_code, 404)

    def test_delete_playlist_checks_ownership(self):
        playlist = Playlist.objects.create(user=self.other, name='Private')
        self.assertEqual(self.client.delete(f'/api/playlists/{playlist.pk}/').status_code, 404)
        playlist = Playlist.objects.create(user=self.user, name='Mine')
        self.assertEqual(self.client.delete(f'/api/playlists/{playlist.pk}/').status_code, 204)
        self.assertFalse(Playlist.objects.filter(pk=playlist.pk).exists())

    @patch('Riptide2.services.ai_response.generate_ai_response')
    def test_clarification_is_saved_and_returned(self, generate):
        generate.return_value = {'type': 'clarification', 'question': 'Which genre?'}
        response = self.client.post(f'/api/chats/{self.chat.pk}/messages/', {'text': 'hello'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['reply'], 'Which genre?')
        self.assertNotIn('playlist', response.data)
        self.assertTrue(self.chat.messages.filter(sender='system', text='Which genre?').exists())

    @patch('Riptide2.services.ai_response.generate_ai_response', side_effect=RuntimeError('mock failure'))
    def test_generation_failure_retains_message_and_reports_error(self, generate):
        response = self.client.post(f'/api/chats/{self.chat.pk}/messages/', {'text': 'hello'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data['generation_error'])
        self.assertEqual(self.chat.messages.filter(sender='user').count(), 1)
        self.assertEqual(GenerationBudget.objects.get().attempts, 1)

    @override_settings(GENERATION_DAILY_LIMIT=1)
    @patch('Riptide2.services.ai_response.generate_ai_response', return_value={'type': 'clarification', 'question': 'Genre?'})
    def test_daily_budget_survives_deleted_chats(self, generate):
        self.client.post(f'/api/chats/{self.chat.pk}/messages/', {'text': 'hello'}, format='json')
        self.chat.delete()
        chat = UserChat.objects.create(user=self.user, name='Another')
        response = self.client.post(f'/api/chats/{chat.pk}/messages/', {'text': 'hello'}, format='json')
        self.assertEqual(response.status_code, 429)
        self.assertEqual(generate.call_count, 1)
        self.assertEqual(chat.messages.count(), 0)

    @patch('Riptide2.services.ai_response.generate_ai_response')
    def test_three_message_limit_blocks_model_call(self, generate):
        ChatMessage.objects.bulk_create([ChatMessage(chat=self.chat, sender='user', text='test') for _ in range(3)])
        response = self.client.post(f'/api/chats/{self.chat.pk}/messages/', {'text': 'fourth'}, format='json')
        self.assertEqual(response.status_code, 429)
        generate.assert_not_called()

    def test_expired_spotify_state_is_consumed(self):
        SpotifyOAuthState.objects.create(state='expired', user=self.user, expires_at=timezone.now()-timedelta(seconds=1))
        response = self.client.get('/spotify/callback/?state=expired&code=test')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(SpotifyOAuthState.objects.exists())

    @patch('Riptide2.views.spotify_auth.exchange_code_for_tokens', return_value={})
    @patch('Riptide2.views.spotify_auth.link_account')
    def test_spotify_callback_cannot_replay_state(self, link, exchange):
        SpotifyOAuthState.objects.create(state='valid', user=self.user, expires_at=timezone.now()+timedelta(minutes=5))
        self.assertEqual(self.client.get('/spotify/callback/?state=valid&code=test').status_code, 302)
        self.assertEqual(self.client.get('/spotify/callback/?state=valid&code=test').status_code, 400)
        exchange.assert_called_once()
