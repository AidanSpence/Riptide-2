"""spotify browser views."""

import spotipy as sp
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect

from .services import spotify_auth


@login_required
def export(request):
    """export the current playlist to spotify."""
    # this uses the playlist and spotify client attached to the request
    user_playlist = request.user_playlist
    track_ids = [track["spotify_track_id"] for track in user_playlist["tracks"]]
    track_uris = ["spotify:track:" + track_id for track_id in track_ids]
    playlist = sp.user_playlist_create(
        user=sp.current_user()["id"],
        name=user_playlist["title"],
        public=False,
        description=user_playlist["description"],
    )
    sp.playlist_add_items(playlist_id=playlist["id"], items=track_uris)


@login_required
def spotify_login(request):
    """start spotify login."""
    state = spotify_auth.generate_state()
    request.session["spotify_state"] = state
    return redirect(spotify_auth.build_authorize_url(state))


@login_required
def spotify_callback(request):
    """finish spotify login and save the account."""
    if request.GET.get("error"):
        return HttpResponseBadRequest("Spotify authorization was denied.")
    if request.GET.get("state") != request.session.pop("spotify_state", None):
        return HttpResponseBadRequest("State mismatch.")
    if not request.GET.get("code"):
        return HttpResponseBadRequest("Missing authorization code.")

    token_data = spotify_auth.exchange_code_for_tokens(request.GET["code"])
    spotify_auth.link_account(request.user, token_data)
    return redirect("home")
