from rest_framework import serializers
from accounts.enums import *
from accounts.models import *
from accounts.serializers import *
from application.models import *
from application.serializers.post_serializer import *
from friends.models import *
from chatting.models import *
from django.shortcuts import get_object_or_404
from django.db.models import Q


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
    # sender_profile = UserProfileSerializer(read_only=True)
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "message_id",
            "chatroom",
            "sender",
            "sender_username",
            "content",
            "created_at",
        ]
        extra_kwargs = {
            "message_id": {"read_only": True},
            "created_at": {"read_only": True},
            "sender": {"read_only": True},
            "sender_username": {"read_only": True},
            "chatroom": {"required": True},
            "content": {"required": True},
        }
