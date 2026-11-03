from datetime import timedelta

import spotipy
from django.utils import timezone

from Riptide2.models import SpotifyAccount
from .spotify_auth import refresh_access_token


class SpotifyNotLinked(Exception):
    """The user hasn't connected a Spotify account."""


def get_valid_token(user) -> str:
    try:
        account = SpotifyAccount.objects.get(user=user)
    except SpotifyAccount.DoesNotExist:
        raise SpotifyNotLinked("User has not linked a Spotify account.")

    if account.expires_at <= timezone.now() + timedelta(seconds=60):
        account = refresh_access_token(account)
    return account.access_token


def get_spotify(user) -> spotipy.Spotify:
    """A spotipy client authenticated as this user."""
    return spotipy.Spotify(auth=get_valid_token(user), requests_timeout=10)


def _parse_track(track: dict) -> dict:
    return {
        "spotify_track_id": track.get("id"),
        "uri": track.get("uri"),
        "name": track.get("name"),
        "artist": ", ".join(a["name"] for a in track.get("artists", [])),
        "album": (track.get("album") or {}).get("name"),
        "explicit": track.get("explicit"),
        "duration_ms": track.get("duration_ms"),
    }


def get_playlist_tracks(user, playlist_id: str) -> list[dict]:
    """Fetch every track in a playlist (handles pagination)."""
    sp = get_spotify(user)
    results = sp.playlist_items(playlist_id, limit=50)
    items = results["items"]
    while results["next"]:
        results = sp.next(results)
        items.extend(results["items"])

    tracks = []
    for item in items:
        # Spotify's newer playlist-items responses use "item"; older ones use "track".
        track = item.get("item") or item.get("track")
        if track and track.get("id"):  # skip removed/unavailable/local tracks
            tracks.append(_parse_track(track))
    return tracks


def create_playlist(user, name: str, description: str, track_ids: list[str]) -> dict:
    """Create a private playlist and add tracks (max 100 per request)."""
    sp = get_spotify(user)
    playlist = sp.user_playlist_create(
        user=sp.current_user()["id"],
        name=name,
        public=False,
        description=description,
    )
    uris = [f"spotify:track:{tid}" for tid in track_ids]
    for i in range(0, len(uris), 100):
        sp.playlist_add_items(playlist["id"], uris[i:i + 100])
    return playlist