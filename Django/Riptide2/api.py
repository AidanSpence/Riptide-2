import json
import logging
from django.conf import settings
from django.utils import timezone
from .models import GenerationBudget
logger = logging.getLogger(__name__)

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Prefetch



from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

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
    """return saved chat messages."""

    class Meta:
        model = ChatMessage
        fields = ("id", "sender", "text", "created_at")
        read_only_fields = fields


class ChatInputSerializer(serializers.Serializer):
    """check new chat messages."""

    text = serializers.CharField(max_length=4000, allow_blank=False, trim_whitespace=True)

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
    """save a message if the chat has space."""
    serializer = ChatInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # lock the chat while checking the limit
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
            chat__user=request.user, sender=ChatMessage.Sender.USER, created_at__date=day,
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
        )

    history = [
        {"role": "user" if m.sender == ChatMessage.Sender.USER else "assistant",
         "content": m.text}
        for m in chat.messages.order_by("created_at", "id")
    ]

    from .services.ai_response import generate_ai_response

    playlist = None
    generation_error = None
    try:
        playlist = generate_ai_response(
            history, user=request.user, playlist_id=None, spotify_playlist_id=request.data.get("id")
        )
    except Exception:
        logger.exception("playlist generation failed for chat %s", chat.pk)
        generation_error = "Your message was saved, but playlist generation failed. Please try again later."

    system_text = ""
    if playlist:
        system_text = playlist.get("message") or playlist.get("question") or ""
        if playlist.get("type") == "spotify_not_linked":
            system_text = "Connect your Spotify account before using that playlist."
        if system_text:
            ChatMessage.objects.create(chat=chat, sender=ChatMessage.Sender.SYSTEM, text=system_text)
        if playlist.get("chat_name"):
            chat.name = playlist["chat_name"][:100]
            chat.save(update_fields=["name"])

    return Response({
        "message": ChatMessageSerializer(message).data,
        "remaining_messages": MESSAGE_LIMIT - count - 1,
        "generation_error": generation_error,
        "reply": system_text,
        **({"playlist": playlist} if playlist and playlist.get("type") == "playlist" else {}),
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
                "duration_s": song.duration_s or 0
            })

        result.append({
            "id": playlist.id,
            "name": playlist.name,
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
