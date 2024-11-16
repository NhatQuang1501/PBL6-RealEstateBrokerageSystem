from django.db import models
from accounts.models import *
from application.models import *
from accounts.enums import *
import uuid


class ChatRoom(models.Model):
    chatroom_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chatrooms_as_user1"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chatrooms_as_user2"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")

    def __str__(self):
        return f"ChatRoom between {self.user1.username} and {self.user2.username}"


class Message(models.Model):
    message_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.text[:50]}"
