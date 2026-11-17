from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.test import SimpleTestCase
from rest_framework.exceptions import ValidationError

from . import api
from .services import ai_response, reference_tracks, spotify_client
from .services.serializers import SearchSerializer


class DeploymentMergeTests(SimpleTestCase):
    """check the new chat and playlist paths without external services."""

    def test_reference_tracks_accept_names_and_song_objects(self):
        serializer = SearchSerializer(data={
            "reference_tracks": [
                "Song A - Artist A",
                {"name": "Song B", "artists": [{"name": "Artist B"}]},
            ],
            "reference_overrides": ["energy"],
        })
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["reference_tracks"], [
            "Song A - Artist A", "Song B - Artist B",
        ])

    @patch.object(reference_tracks, "find_reference_songs")
    def test_database_reference_features_keep_explicit_overrides(self, find_songs):
        find_songs.return_value = [
            {"energy": 80.0, "danceability": 40.0, "bpm": 110.0},
            {"energy": 60.0, "danceability": 80.0, "bpm": 130.0},
        ]
        plan = {"search": {
            "reference_tracks": ["A - B"],
            "reference_overrides": ["energy"],
            "audio_features": {"energy": {"target": 0.2}},
        }}
        updated = reference_tracks.apply_reference_features(plan)
        self.assertEqual(updated["search"]["audio_features"]["energy"]["target"], 0.2)
        self.assertAlmostEqual(updated["search"]["audio_features"]["danceability"]["target"], 0.6)
        self.assertEqual(updated["search"]["audio_features"]["bpm"]["target"], 120.0)
        self.assertNotIn("danceability", plan["search"]["audio_features"])

    def test_saved_spotify_context_is_reused_in_followup(self):
        messages = [
            SimpleNamespace(sender="user", text="Similar music", playlist_data={
                "source": "spotify", "name": "Reference", "track_count": 1,
                "tracks": [{"name": "Song A", "artists": ["Artist A"]}],
            }),
            SimpleNamespace(sender="user", text="Quieter", playlist_data=None),
        ]
        history = ai_response.build_chat_history(messages)
        self.assertIn('"name": "Reference"', history[0]["content"])
        self.assertEqual(history[1]["content"], "Quieter")

    @patch.object(ai_response, "create_playlist", return_value={"name": "Playlist", "tracks": []})
    @patch.object(ai_response, "analyse_music_request")
    @patch.object(ai_response, "get_provider")
    def test_ai_validation_retries_once(self, provider, analyse, create_playlist):
        provider.return_value.stream.side_effect = iter([["bad json"], ["valid json"]])
        analyse.side_effect = [ValidationError("invalid"), ({"playlist": {}}, False, None)]
        response = ai_response.generate_ai_response([{"role": "user", "content": "Music"}], user=None)
        self.assertEqual(response["type"], "playlist")
        self.assertEqual(provider.return_value.stream.call_count, 2)
        self.assertIn("previous response failed validation", provider.return_value.stream.call_args.args[0][-1]["content"].lower())

    @patch.object(spotify_client, "get_spotify")
    def test_spotify_tracks_are_paginated_and_skip_episodes(self, get_spotify):
        sp = get_spotify.return_value
        sp.playlist_items.return_value = {
            "items": [{"track": {"name": "A", "artists": [{"name": "X"}]}},
                      {"track": {"name": "Podcast", "type": "episode"}}],
            "next": "page2",
        }
        sp.next.return_value = {"items": [{"item": {"name": "B", "artists": []}}], "next": None}
        tracks = spotify_client.get_playlist_tracks(object(), "playlistID")
        self.assertEqual([t["name"] for t in tracks], ["A", "B"])

    def test_chat_response_serializes_separate_playlist_cards(self):
        message = SimpleNamespace(sender="user", playlist_id=None, playlist_data={
            "source": "spotify", "name": "Reference", "tracks": [{"name": "A"}],
        })
        serializer = api.ChatMessageSerializer()
        self.assertIsNone(serializer.get_playlist(message))
        self.assertEqual(serializer.get_spotify_playlist(message)["name"], "Reference")
        self.assertNotIn("tracks", serializer.get_spotify_playlist(message))
        message.sender = "system"
        message.playlist_id = 42
        self.assertEqual(serializer.get_playlist(message), message.playlist_data)
        message.playlist_id = None
        self.assertIsNone(serializer.get_playlist(message))

    def test_invalid_spotify_id_is_rejected(self):
        self.assertFalse(api.ChatInputSerializer(data={
            "text": "Music", "spotify_playlist_id": "../secret"
        }).is_valid())
