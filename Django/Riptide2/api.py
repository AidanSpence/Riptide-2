import logging
from django.conf import settings
from django.utils import timezone
from .models import GenerationBudget
logger = logging.getLogger(__name__)

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch



from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Playlist, PlaylistSong
from .models import ChatMessage, UserChat
from .models import SpotifyAccount

User = get_user_model()
MESSAGE_LIMIT = 3

# ---------------------------------------------------------------------
# Account serializers
# ---------------------------------------------------------------------
class SignupSerializer(serializers.ModelSerializer):
    """check account details before signup."""

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password")
        read_only_fields = ("id",)

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

# ---------------------------------------------------------------------
# Chat serializers
# ---------------------------------------------------------------------
class UserChatSerializer(serializers.ModelSerializer):
    """read and create chat records."""

    name = serializers.CharField(max_length=100, required=False, default="New chat")

    class Meta:
        model = UserChat
        fields = ("id", "name", "created_at")
        read_only_fields = ("id", "created_at")


class ChatMessageSerializer(serializers.ModelSerializer):
    """return chat messages and their saved playlist attachments."""

    playlist = serializers.SerializerMethodField()
    spotify_playlist = serializers.SerializerMethodField()

    def get_playlist(self, message):
        # a deleted Playlist sets the FK to NULL; do not resurrect its saved card
        # from playlist_data when the chat is loaded again.
        if (message.sender == ChatMessage.Sender.SYSTEM
                and getattr(message, "playlist_id", None) is not None):
            return message.playlist_data
        return None

    def get_spotify_playlist(self, message):
        data = message.playlist_data or {}
        if message.sender == ChatMessage.Sender.USER and data.get("source") == "spotify":
            return {key: value for key, value in data.items() if key != "tracks"}
        return None

    class Meta:
        model = ChatMessage
        fields = ("id", "sender", "text", "created_at", "playlist", "spotify_playlist")
        read_only_fields = fields


class ChatInputSerializer(serializers.Serializer):
    """check new chat messages."""

    text = serializers.CharField(max_length=4000, allow_blank=False, trim_whitespace=True)
    spotify_playlist_id = serializers.RegexField(
        r"^[A-Za-z0-9]{1,64}$", required=False, allow_blank=True, allow_null=True
    )

# ---------------------------------------------------------------------
# Account endpoints
# ---------------------------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    """create an account with a username and password."""
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """return the logged in user."""
    user = request.user
    return Response({"id": str(user.id), "email": user.email, "username": user.username})

# ---------------------------------------------------------------------
# Saved chat endpoints
# ---------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def chats(request):
    """list chats or create a new chat."""
    if request.method == "GET":
        user_chats = UserChat.objects.filter(user=request.user).order_by("-created_at", "-id")
        return Response({"chats": UserChatSerializer(user_chats, many=True).data})

    serializer = UserChatSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    chat = serializer.save(user=request.user)
    return Response(UserChatSerializer(chat).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def chat_detail(request, chat_id):
    """load or delete one chat."""
    chat = get_object_or_404(UserChat, id=chat_id, user=request.user)

    if request.method == "DELETE":
        chat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    messages = chat.messages.all()
    count = chat.messages.filter(sender=ChatMessage.Sender.USER).count()
    return Response({
        **UserChatSerializer(chat).data,
        "messages": ChatMessageSerializer(messages, many=True).data,
        "remaining_messages": max(0, MESSAGE_LIMIT - count),
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_send_message(request, chat_id):
    """save a chat message, optionally with a Spotify playlist reference."""
    serializer = ChatInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # fail before the external call when the user doesn't own this chat
    chat = get_object_or_404(UserChat, id=chat_id, user=request.user)
    if chat.messages.filter(sender=ChatMessage.Sender.USER).count() >= MESSAGE_LIMIT:
        return Response(
            {"error": "Message limit reached", "remaining_messages": 0}, status=429
        )

    attachment = None
    spotify_id = serializer.validated_data.get("spotify_playlist_id")
    if spotify_id:
        from .services.spotify_client import get_playlist_context, SpotifyNotLinked
        from spotipy.exceptions import SpotifyException
        from requests.exceptions import RequestException

        try:
            attachment = get_playlist_context(request.user, spotify_id)
        except (SpotifyNotLinked, ValueError) as error:
            return Response({"error": str(error)}, status=400)
        except (SpotifyException, RequestException):
            logger.exception("spotify playlist lookup failed for chat %s", chat.pk)
            return Response(
                {"error": "Could not read the Spotify playlist. Check its access and try again."},
                status=502,
            )

    # keep the deployment's concurrency, message and daily budget limits
    with transaction.atomic():
        chat = get_object_or_404(
            UserChat.objects.select_for_update(), id=chat_id, user=request.user
        )
        count = chat.messages.filter(sender=ChatMessage.Sender.USER).count()
        if count >= MESSAGE_LIMIT:
            return Response(
                {"error": "Message limit reached", "remaining_messages": 0},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        day = timezone.now().date()
        budget, _ = GenerationBudget.objects.get_or_create(day=day)
        budget = GenerationBudget.objects.select_for_update().get(day=day)
        user_attempts = ChatMessage.objects.filter(
            chat__user=request.user, sender=ChatMessage.Sender.USER,
            created_at__date=day,
        ).count()
        if (budget.attempts >= settings.GENERATION_DAILY_LIMIT
                or user_attempts >= settings.GENERATION_USER_DAILY_LIMIT):
            return Response({"error": "Daily generation limit reached. Try again tomorrow."}, status=429)
        budget.attempts += 1
        budget.save(update_fields=["attempts"])

        message = ChatMessage.objects.create(
            chat=chat,
            sender=ChatMessage.Sender.USER,
            text=serializer.validated_data["text"],
            playlist_data=attachment,
        )

    from .services.ai_response import generate_ai_response, build_chat_history
    history = build_chat_history(chat.messages.order_by("created_at", "id"))

    playlist = None
    generation_error = None
    try:
        playlist = generate_ai_response(history, user=request.user)
    except Exception:
        logger.exception("playlist generation failed for chat %s", chat.pk)
        generation_error = "Your message was saved, but playlist generation failed. Please try again later."

    reply = None
    if playlist and playlist.get("type") in ("playlist", "clarification"):
        reply_text = playlist.get("message") or playlist.get("question") or ""
        saved_id = playlist.get("playlist_id")
        saved_playlist = (
            Playlist.objects.filter(pk=saved_id, user=request.user).first()
            if saved_id else None
        )

        card = None
        if saved_playlist:
            card = {
                "id": saved_playlist.id,
                "name": playlist.get("name") or saved_playlist.name,
                "description": playlist.get("description") or saved_playlist.description,
                "message": "",
                "chat_name": "",
                "tracks": [
                    {**track, "duration_s": track.get("duration_s") or 0}
                    for track in playlist.get("tracks", [])
                ],
            }

        if reply_text or card:
            reply = ChatMessage.objects.create(
                chat=chat,
                sender=ChatMessage.Sender.SYSTEM,
                text=reply_text,
                playlist=saved_playlist,
                playlist_data=card,
            )
        if playlist.get("chat_name"):
            chat.name = playlist["chat_name"][:100]
            chat.save(update_fields=["name"])

    return Response({
        "message": ChatMessageSerializer(message).data,
        "reply": ChatMessageSerializer(reply).data if reply else None,
        "chat_name": chat.name,
        "remaining_messages": MESSAGE_LIMIT - count - 1,
        "generation_error": generation_error,
    }, status=status.HTTP_201_CREATED)

# ---------------------------------------------------------------------
# Playlist retrieve endpoint
# ---------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_playlists(request):
    """get saved playlists for the logged-in user."""

    # only retrieve playlists owned by this user
    playlists = Playlist.objects.filter(
        user=request.user
    ).prefetch_related(
        Prefetch(
            "playlistsong_set",
            queryset=PlaylistSong.objects.select_related(
                "song"
            ).prefetch_related(
                "song__artists"
            ).order_by("position")
        )
    ).order_by("-created_at")

    result = []

    for playlist in playlists:
        tracks = []

        for item in playlist.playlistsong_set.all():
            song = item.song

            tracks.append({
                "id": song.id,
                "title": song.title,
                "artists": ", ".join(
                    artist.name for artist in song.artists.all()
                ),
                "duration_s": song.duration_s or 0,
                "spotify_track_id": song.spotify_track_id,
            })

        result.append({
            "id": playlist.id,
            "name": playlist.name,
            "description": playlist.description,
            "message": "",
            "chat_name": "",
            "tracks": tracks
        })

    return Response({"playlists": result})
# ---------------------------------------------------------------------
# Spotify check if linked
# ---------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def spotify_status(request):
    """check if the user has spotify linked."""

    connected = SpotifyAccount.objects.filter(
        user=request.user
    ).exists()

    return Response({"connected": connected})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_playlist(request, playlist_id):
    """delete only a playlist owned by this account."""
    playlist = get_object_or_404(Playlist, pk=playlist_id, user=request.user)
    playlist.delete()
    return Response(status=204)


def health(request):
    """check the web process without calling the database or external APIs."""
    return JsonResponse({"status": "ok"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def spotify_logout(request):
    """unlink Spotify without deleting chats or generated playlists."""
    SpotifyAccount.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
