from datetime import timedelta
import spotipy
from django.utils import timezone
from Riptide2.models import SpotifyAccount
from .spotify_auth import refresh_access_token

MAX_CONTEXT_TRACKS = 75

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
    """keep the metadata used to understand the user's music."""
    album = track.get("album") or {}
    return {
        "name": track.get("name"),
        "artists": [a["name"] for a in (track.get("artists") or []) if a.get("name")],
        "album": album.get("name"),
        "release_date": album.get("release_date"),
        "duration_ms": track.get("duration_ms"),
        "popularity": track.get("popularity"),
        "explicit": track.get("explicit"),
    }


def get_playlist_context(user, playlist_id: str) -> dict:
    """read a playlist with the user's spotify token."""
    sp = get_spotify(user)
    playlist = sp.playlist(playlist_id, fields="id,name,images,external_urls")
    tracks = get_playlist_tracks(user, playlist_id)
    if not tracks:
        raise ValueError("This Spotify playlist has no readable music tracks.")
    images = playlist.get("images") or []
    return {
        "source": "spotify",
        "id": playlist_id,
        "name": playlist.get("name") or "Spotify playlist",
        "image": images[0]["url"] if images else None,
        "url": f"https://open.spotify.com/playlist/{playlist_id}",
        "track_count": len(tracks),
        "tracks": tracks[:MAX_CONTEXT_TRACKS],
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
        if track and track.get("type", "track") == "track" and track.get("name"):
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