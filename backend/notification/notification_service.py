from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from notification.models import Notification
import uuid
from datetime import datetime
import pytz


class NotificationService:
    @staticmethod
    def add_notification(user, description, additional_info=None):
        notification_id = uuid.uuid4()
        notification = Notification.objects.create(
            user=user,
            notification_id=notification_id,
            is_read=False,
            description=description,
            data={
                "additional_info": additional_info,
                "created_at": datetime.now(pytz.timezone("Asia/Ho_Chi_Minh")).strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),
            },
        )

        # Gửi thông báo qua WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user.user_id}",
            {
                "type": "notify_user",
                "notification": {
                    "notification_id": str(notification.notification_id),
                    "description": notification.description,
                    "data": notification.data,
                },
            },
        )
