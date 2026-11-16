import requests
import spotipy
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services import spotify_auth
from .models import Playlist, PlaylistSong, SpotifyAccount
from .services.spotify_client import SpotifyNotLinked, export_playlist, get_spotify


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def spotify_login(request):
    """start spotify login."""

    state = spotify_auth.generate_state()

    cache.set(
        f"spotify_oauth:{state}",
        str(request.user.pk),
        timeout=600
    )

    url = spotify_auth.build_authorize_url(state)

    return Response({"url": url})


def spotify_callback(request):
    """finish spotify login and save the account."""

    state = request.GET.get("state")

    if not state:
        return HttpResponseBadRequest("Missing state.")

    cache_key = f"spotify_oauth:{state}"
    user_id = cache.get(cache_key)

    if not user_id:
        return HttpResponseBadRequest("Invalid or expired state.")

    # consume the state so it cannot be reused
    cache.delete(cache_key)

    if request.GET.get("error"):
        return HttpResponseBadRequest("Spotify authorization was denied.")

    code = request.GET.get("code")

    if not code:
        return HttpResponseBadRequest("Missing authorization code.")

    user = get_user_model().objects.get(pk=user_id)

    token_data = spotify_auth.exchange_code_for_tokens(code)
    spotify_auth.link_account(user, token_data)

    return redirect(settings.FRONTEND_URL)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def spotify_logout(request):
    """remove the user's saved spotify connection."""
    SpotifyAccount.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def export(request, playlist_id):
    """push a saved playlist to the user's linked Spotify account."""
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)

    # returns the existing link instead of making a duplicate.
    if playlist.spotify_playlist_id and not request.data.get("force"):
        return Response({
            "spotify_playlist_id": playlist.spotify_playlist_id,
            "url": playlist.spotify_url,
            "already_exported": True,
        })

    track_ids = list(
        PlaylistSong.objects.filter(playlist=playlist)
        .select_related("song")
        .order_by("position")
        .values_list("song__spotify_track_id", flat=True)
    )

    if not track_ids:
        return Response({"error": "Playlist has no tracks."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = export_playlist(
            request.user,
            title=playlist.name,
            description=playlist.description,
            track_ids=track_ids,
        )
    except SpotifyNotLinked:
        return Response(
            {"error": "Connect your Spotify account first."},
            status=status.HTTP_409_CONFLICT,
        )
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except requests.RequestException:
        return Response(
            {"error": "Spotify could not be reached or its token could not be refreshed. Reconnect Spotify and try again."},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except spotipy.SpotifyException as e:
        if e.http_status in (401, 403):
            return Response(
                {"error": "Spotify denied playlist access. Reconnect Spotify to grant playlist permissions; also check the app account restrictions."},
                status=status.HTTP_409_CONFLICT,
            )
        # other upstream errors remain visible as a failed export
        return Response(
            {"error": "Spotify rejected the request.", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    playlist.spotify_playlist_id = result["spotify_playlist_id"]
    playlist.spotify_url = result["url"]
    playlist.save(update_fields=["spotify_playlist_id", "spotify_url", "updated_at"])

    return Response(result, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def spotify_playlists(request):
    """list the playlists on the user's linked Spotify account."""
    try:
        sp = get_spotify(request.user)
    except SpotifyNotLinked:
        return Response({"linked": False, "playlists": []})

    playlists = []
    try:
        spotify_user_id = sp.current_user()["id"]
        results = sp.current_user_playlists(limit=50)

        while results:
            for p in results["items"]:
                # skip playlists owned by someone else
                if not p or (p.get("owner") or {}).get("id") != spotify_user_id:
                    continue

                images = p.get("images") or []
                playlists.append({
                    "id": p["id"],
                    "name": p["name"],
                    "image": images[0]["url"] if images else None,
                    "track_count": (p.get("items") or p.get("tracks") or {}).get("total"),
                    "url": p["external_urls"]["spotify"],
                })

            results = sp.next(results) if results.get("next") else None
    except spotipy.SpotifyException as e:
        return Response(
            {"error": "Spotify rejected the request.", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({"linked": True, "playlists": playlists})