
from rest_framework import serializers
from .models import UserChat, ChatMessage


class UserChatSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=100,
        required=False,
        default="New chat"
    )

    class Meta:
        model = UserChat
        fields = ("id", "name", "created_at")
        read_only_fields = ("id", "created_at")


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ("id", "sender", "text", "created_at")
        read_only_fields = fields


class ChatInputSerializer(serializers.Serializer):
    text = serializers.CharField(
        max_length=4000,
        allow_blank=False,
        trim_whitespace=True
    )
