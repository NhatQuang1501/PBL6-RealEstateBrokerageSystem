from rest_framework import serializers
from chatting.models import *
from accounts.serializers import UserProfile


class ChatRoomSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True)

    class Meta:
        model = ChatRoom
        fields = [
            "chatroom_id",
            "chatroom_name",
            "created_by",
            "participants",
            "is_private",
            "created_at",
        ]
        extra_kwargs = {
            "chatroom_id": {"read_only": True},
            "chatroom_name": {"required": False},
            "participants": {"required": True},
            "is_private": {"required": True},
            "created_at": {"read_only": True},
        }


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "message_id",
            "chatroom",
            "sender",
            "sender_username",
            "sender_avatar",
            "content",
            "created_at",
        ]
        extra_kwargs = {
            "message_id": {"read_only": True},
            "created_at": {"read_only": True},
            "sender": {"read_only": True},
            "sender_username": {"read_only": True},
            "sender_avatar": {"read_only": True},
            "chatroom": {"required": True},
            "content": {"required": True},
        }

    def get_sender_avatar(self, obj):
        return obj.sender.profile.avatar.url if obj.sender.profile.avatar else None
