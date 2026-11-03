
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services import spotify_auth


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
