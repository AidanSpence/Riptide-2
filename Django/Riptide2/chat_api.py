
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserChat, ChatMessage
from .chat_serializers import (
    UserChatSerializer,
    ChatMessageSerializer,
    ChatInputSerializer,
)

MESSAGE_LIMIT = 3


# GET: List conversations
# POST: Create a conversation
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def chats(request):

    if request.method == "GET":
        user_chats = UserChat.objects.filter(
            user=request.user
        ).order_by("-created_at", "-id")

        return Response({
            "chats": UserChatSerializer(user_chats, many=True).data
        })

    serializer = UserChatSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    chat = serializer.save(user=request.user)

    return Response(
        UserChatSerializer(chat).data,
        status=status.HTTP_201_CREATED
    )


# GET: Load one conversation and its messages
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_detail(request, chat_id):

    chat = get_object_or_404(
        UserChat,
        id=chat_id,
        user=request.user
    )

    messages = chat.messages.all()

    user_count = chat.messages.filter(
        sender=ChatMessage.Sender.USER
    ).count()

    return Response({
        **UserChatSerializer(chat).data,
        "messages": ChatMessageSerializer(messages, many=True).data,
        "remaining_messages": max(0, MESSAGE_LIMIT - user_count)
    })


# POST: Submit a new user message
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_send_message(request, chat_id):

    serializer = ChatInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Lock the conversation while checking and updating its count.
    with transaction.atomic():
        chat = get_object_or_404(
            UserChat.objects.select_for_update(),
            id=chat_id,
            user=request.user
        )

        user_count = chat.messages.filter(
            sender=ChatMessage.Sender.USER
        ).count()

        if user_count >= MESSAGE_LIMIT:
            return Response(
                {
                    "error": "Message limit reached",
                    "remaining_messages": 0
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        message = ChatMessage.objects.create(
            chat=chat,
            sender=ChatMessage.Sender.USER,
            text=serializer.validated_data["text"]
        )

    return Response(
        {
            "message": ChatMessageSerializer(message).data,
            "remaining_messages": MESSAGE_LIMIT - user_count - 1
        },
        status=status.HTTP_201_CREATED
    )
