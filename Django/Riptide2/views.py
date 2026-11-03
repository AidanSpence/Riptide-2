from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect

from .services import spotify_auth
from .services.spotify_client import SpotifyNotLinked, create_playlist, get_playlist_tracks


@login_required
def export(request):
    """Export the current playlist to Spotify."""
    user_playlist = request.user_playlist
    track_ids = [t["spotify_track_id"] for t in user_playlist["tracks"]]
    try:
        playlist = create_playlist(
            request.user,
            user_playlist["title"],
            user_playlist["description"],
            track_ids,
        )
    except SpotifyNotLinked:
        return redirect("spotify_login")
    return JsonResponse({"playlist_id": playlist["id"]})


@login_required
def import_playlist(request, playlist_id):
    """Pull all tracks from a Spotify playlist."""
    try:
        tracks = get_playlist_tracks(request.user, playlist_id)
    except SpotifyNotLinked:
        return redirect("spotify_login")
    return JsonResponse({"tracks": tracks})


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
