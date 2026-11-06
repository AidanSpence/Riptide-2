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


def parse_track(track: dict) -> dict:
    return {
        "spotify_track_id": track.get("uri"),
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
        track = item.get("item") or item.get("track")
        if track and track.get("id"):
            tracks.append(parse_track(track))
    return tracks

def _to_uri(track_id: str) -> str:
    return track_id if track_id.startswith("spotify:track:") else f"spotify:track:{track_id}"


def export_playlist(user, title: str, description: str, track_ids: list[str]) -> dict:
    """Create a private playlist on the user's Spotify account and fill it."""
    sp = get_spotify(user)

    # POST /me/playlists creates the playlist for the current user.
    # (Recent spotipy: sp.current_user_playlist_create(...). If your version
    # lacks it, _post works the same way.)
    new_playlist = sp._post(
        "me/playlists",
        payload={
            "name": title[:100],
            "public": False,
            "description": (description or "")[:300],
        },
    )

    uris = [_to_uri(t) for t in track_ids if t]
    # Spotify accepts at most 100 items per request
    for i in range(0, len(uris), 100):
        sp.playlist_add_items(new_playlist["id"], uris[i:i + 100])

    return {
        "spotify_playlist_id": new_playlist["id"],
        "url": new_playlist["external_urls"]["spotify"],
        "tracks_added": len(uris),
    }