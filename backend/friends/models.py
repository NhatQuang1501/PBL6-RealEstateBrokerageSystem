from django.db import models
from accounts.models import *
from application.models import *
from accounts.enums import *
import uuid


class FriendRequest(models.Model):
    friendrequest_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendrequest_sender_set"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendrequest_receiver_set"
    )

    friendrequest_status = models.CharField(
        max_length=50,
        choices=FriendRequest_status.choices,
        default=FriendRequest_status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("sender", "receiver")

    def __str__(self):
        return f"{self.sender.username} - {self.receiver.username} ({self.friendrequest_status})"

    @property
    def sender_profile(self):
        sender_profile = UserProfile.objects.get(user=self.sender)
        return sender_profile

    def receiver_profile(self):
        receiver_profile = UserProfile.objects.get(user=self.receiver)
        return receiver_profile


class Friendship(models.Model):
    friendship_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendships_as_user1"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendships_as_user2"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")
        constraints = [
            models.CheckConstraint(
                check=~models.Q(user1=models.F("user2")), name="users_must_be_different"
            )
        ]

    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"
