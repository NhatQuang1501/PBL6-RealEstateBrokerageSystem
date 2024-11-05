from rest_framework import serializers
from accounts.enums import *
from accounts.models import *
from accounts.serializers import *
from application.models import *
from application.serializers import *
from chat.models import *
from django.shortcuts import get_object_or_404
from django.db.models import Q


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_profile = UserProfileSerializer(read_only=True)
    receiver_profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            "message_id",
            "sender",
            "receiver",
            "sender_profile",
            "receiver_profile",
            "message",
            "is_read",
            "created_at",
        ]
        extra_kwargs = {
            "message_id": {"read_only": True},
            "created_at": {"read_only": True},
            "is_read": {"read_only": True},
            "sender": {"read_only": True},
            "receiver": {"required": True},
            "message": {"required": True},
        }


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_profile = UserProfileSerializer(read_only=True)
    receiver_profile = UserProfileSerializer(read_only=True)

    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(
        source="receiver.username", read_only=True
    )  # Thêm receiver_username vào phản hồi

    status_display = serializers.CharField(
        source="get_friendrequest_status_display", read_only=True
    )

    # Nhận receiver là username từ request
    receiver = serializers.CharField(write_only=True)

    class Meta:
        model = FriendRequest
        fields = [
            "friendrequest_id",
            "sender",
            "sender_username",
            "receiver",  # Nhận username thay vì UUID
            "receiver_username",  # Thêm receiver_username vào phản hồi
            "sender_profile",
            "receiver_profile",
            "friendrequest_status",
            "status_display",
            "created_at",
        ]
        extra_kwargs = {
            "friendrequest_id": {"read_only": True},
            "created_at": {"read_only": True},
            "sender": {"read_only": True},
            "receiver": {"required": True},
        }

    def create(self, validated_data):
        # Khi tạo request, sender là người dùng hiện tại
        request = self.context.get("request")
        sender = request.user
        # Tìm receiver dựa trên username
        receiver_username = validated_data.pop("receiver")

        try:
            receiver = User.objects.get(username=receiver_username)

        except User.DoesNotExist:
            raise serializers.ValidationError({"receiver": "Người dùng không tồn tại"})

        if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
            raise serializers.ValidationError(
                {"error": "Đã gửi lời mời kết bạn cho người dùng này."}
            )

        # Tạo FriendRequest với sender và receiver
        friend_request = FriendRequest.objects.create(
            sender=sender, receiver=receiver, **validated_data
        )

        return friend_request


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ["user1", "user2", "created_at"]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }
