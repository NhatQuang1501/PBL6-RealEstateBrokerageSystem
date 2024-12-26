from rest_framework import serializers
from notification.models import *


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "notification_id",
            "user",
            "description",
            "created_at",
            "data",
            "is_read",
        ]
        extra_kwargs = {"notification_id": {"read_only": True}}
