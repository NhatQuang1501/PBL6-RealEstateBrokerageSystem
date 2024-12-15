from django.db import models
from django.conf import settings
from accounts.models import *
from application.models import *
from accounts.enums import *
import uuid


class ChatRoom(models.Model):
    chatroom_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    negotiation = models.ForeignKey(
        Negotiation, on_delete=models.CASCADE, related_name="chatrooms", null=True
    )
    is_private = models.BooleanField(
        default=False
    )  # Xác định phòng chat riêng tư hay nhóm
    chatroom_name = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_chatrooms", null=True
    )
    participants = models.ManyToManyField(User, related_name="chatrooms")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            self.chatroom_name
            if self.chatroom_name
            else f"Private Chat - {self.created_by.username}"
        )


class Message(models.Model):
    message_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_sender"
    )
    content = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.message_id}"

    @property
    def sender_profile(self):
        sender_profile = UserProfile.objects.get(user=self.sender)
        return sender_profile
