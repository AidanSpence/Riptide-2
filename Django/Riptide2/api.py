import json
import traceback

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
@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def chats(request):
    """list chats or create a new chat."""
    if request.method == "GET":
        user_chats = UserChat.objects.filter(user=request.user).order_by("-created_at", "-id")
        return Response({"chats": UserChatSerializer(user_chats, many=True).data})

    if request.method == "DELETE":
        chat_id = request.chatId
        try:
            delete_chat = UserChat.objects.get(chat_id).delete()
        except UserChat.DoesNotExist:
            return Response({"error", "chat doesn't exist"})

    serializer = UserChatSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    chat = serializer.save(user=request.user)
    return Response(UserChatSerializer(chat).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_detail(request, chat_id):
    """load one chat and its remaining message count."""
    chat = get_object_or_404(UserChat, id=chat_id, user=request.user)
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
    try:
        playlist = generate_ai_response(
            history, user=request.user, playlist_id=None, spotify_playlist_id=None
        )
    except Exception:
        traceback.print_exc()
        # still return the saved message so the UI doesn't lose it

    return Response({
        "message": ChatMessageSerializer(message).data,
        "remaining_messages": MESSAGE_LIMIT - count - 1,
        **({"playlist": playlist} if playlist else {}),
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
                "artists": [
                    artist.name for artist in song.artists.all()
                ],
                "duration_s": song.duration_s,
            })

        result.append({
            "id": playlist.id,
            "title": playlist.name,
            "tracks": tracks,
            "duration_s": sum(
                track["duration_s"] or 0
                for track in tracks
            ),
        })

    return Response({"playlists": result})
