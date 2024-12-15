from django.db import models
import uuid
from accounts.models import User


class Notification(models.Model):
    notification_id = models.UUIDField(
        primary_key=True, editable=False, default=uuid.uuid4
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.description}"
