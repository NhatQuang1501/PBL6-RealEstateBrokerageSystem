import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import ChatRoom, Message
import uuid


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Lấy chatroom_id từ URL route
        self.chatroom_id = self.scope["url_route"]["kwargs"]["chatroom_id"]
        self.chatroom_group_name = f"chat_{self.chatroom_id}"

        # Tham gia nhóm WebSocket theo chatroom_id
        await self.channel_layer.group_add(self.chatroom_group_name, self.channel_name)

        # Chấp nhận kết nối WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Thoát khỏi nhóm WebSocket
        await self.channel_layer.group_discard(
            self.chatroom_group_name, self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        sender_id = text_data_json["sender_id"]
        message = text_data_json["message"]

        # Lưu tin nhắn vào database
        sender = User.objects.get(user_id=uuid.UUID(sender_id))
        chatroom = ChatRoom.objects.get(chatroom_id=self.chatroom_id)

        # Tạo và lưu tin nhắn
        new_message = Message.objects.create(
            chatroom=chatroom, sender=sender, text=message
        )

        # Gửi tin nhắn tới tất cả người dùng trong nhóm
        await self.channel_layer.group_send(
            self.chatroom_group_name,
            {
                "type": "chat_message",
                "message": new_message.text,
                "sender_id": str(new_message.sender.user_id),
                "created_at": new_message.created_at.isoformat(),
            },
        )

    # Phương thức để xử lý tin nhắn từ nhóm WebSocket
    async def chat_message(self, event):
        message = event["message"]
        sender_id = event["sender_id"]
        created_at = event["created_at"]

        # Gửi tin nhắn tới WebSocket client
        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "sender_id": sender_id,
                    "created_at": created_at,
                }
            )
        )
