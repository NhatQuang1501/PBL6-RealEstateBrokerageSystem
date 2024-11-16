from rest_framework import serializers
from .models import *


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["chatroom_id", "user1", "user2", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username")

    class Meta:
        model = Message
        fields = [
            "message_id",
            "chatroom",
            "sender",
            "sender_username",
            "text",
            "created_at",
        ]
