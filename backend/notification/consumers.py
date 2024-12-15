from channels.generic.websocket import AsyncWebsocketConsumer
import json
from notification.models import Notification
from asgiref.sync import sync_to_async
import uuid


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close()
            return

        self.group_name = f"user_{user.user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Gửi tất cả thông báo khi kết nối
        all_notifications, count = await self.get_all_notifications(user)
        await self.send(
            text_data=json.dumps(
                {
                    "type": "all_notifications",
                    "count": count,
                    "notifications": all_notifications,
                }
            )
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        user = self.scope["user"]

        if data.get("action") == "mark_as_read":
            notifications_id = data["notifications_id"]
            valid_notifications_id = [
                nid for nid in notifications_id if self.is_valid_uuid(nid)
            ]
            await self.mark_notifications_as_read(user, valid_notifications_id)

    async def notify_user(self, event):
        notification = event["notification"]
        user = self.scope["user"]

        # Lấy tất cả thông báo
        all_notifications, count = await self.get_all_notifications(user)

        # Gửi thông báo mới
        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_notification",
                    "notifications": notification,
                }
            )
        )

        # Gửi danh sách tất cả thông báo
        await self.send(
            text_data=json.dumps(
                {
                    "type": "all_notifications",
                    "count": count,
                    "notifications": all_notifications,
                }
            )
        )

    @sync_to_async
    def get_all_notifications(self, user):
        notifications = Notification.objects.filter(user=user).order_by("-created_at")
        notification_list = [
            {
                "notification_id": str(noti.notification_id),
                "description": noti.description,
                "data": noti.data,
            }
            for noti in notifications
        ]
        count = notifications.count()
        return notification_list, count

    @sync_to_async
    def mark_notifications_as_read(self, user, notifications_id):
        Notification.objects.filter(
            user=user, notification_id__in=notifications_id
        ).update(is_read=True)

    def is_valid_uuid(self, uuid_to_test, version=4):
        try:
            uuid_obj = uuid.UUID(uuid_to_test, version=version)
        except ValueError:
            return False
        return str(uuid_obj) == uuid_to_test
