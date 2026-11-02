import secrets
from datetime import timedelta
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.utils import timezone

from Riptide2.models import SpotifyAccount

AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
ME_URL = "https://api.spotify.com/v1/me"


def generate_state() -> str:
    """Random value stored in the session to protect against CSRF."""
    return secrets.token_urlsafe(16)


def build_authorize_url(state: str) -> str:
    params = {
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": settings.SPOTIFY_SCOPES,
        "state": state,
    }
    return f"{AUTH_URL}?{urlencode(params)}"


def _token_request(data: dict) -> dict:
    resp = requests.post(
        TOKEN_URL,
        data=data,
        auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET),
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def exchange_code_for_tokens(code: str) -> dict:
    return _token_request({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
    })


def link_account(user, token_data: dict) -> SpotifyAccount:
    """Create or update the user's SpotifyAccount from a token response."""
    me = requests.get(
        ME_URL,
        headers={"Authorization": f"Bearer {token_data['access_token']}"},
        timeout=10,
    )
    me.raise_for_status()

    account, _ = SpotifyAccount.objects.update_or_create(
        user=user,
        defaults={
            "spotify_user_id": me.json()["id"],
            "access_token": token_data["access_token"],
            "refresh_token": token_data["refresh_token"],
            "expires_at": timezone.now() + timedelta(seconds=token_data["expires_in"]),
        },
    )
    return account


def refresh_access_token(account: SpotifyAccount) -> SpotifyAccount:
    token_data = _token_request({
        "grant_type": "refresh_token",
        "refresh_token": account.refresh_token,
    })
    account.access_token = token_data["access_token"]
    # Spotify only sometimes returns a new refresh token; keep the old one if not.
    account.refresh_token = token_data.get("refresh_token", account.refresh_token)
    account.expires_at = timezone.now() + timedelta(seconds=token_data["expires_in"])
    account.save()
    return account