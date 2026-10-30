from datetime import timedelta

import requests
from django.utils import timezone

from Riptide2.models import SpotifyAccount
from .spotify_auth import refresh_access_token

API_BASE = "https://api.spotify.com/v1"


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


def spotify_request(user, method: str, path: str, **kwargs):
    """Call the Spotify API as this user. Example:
    spotify_request(user, "GET", "/me/playlists", params={"limit": 20})
    """
    token = get_valid_token(user)
    resp = requests.request(
        method,
        f"{API_BASE}{path}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
        **kwargs,
    )
    resp.raise_for_status()
    return resp.json() if resp.content else None