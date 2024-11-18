from channels.generic.websocket import AsyncWebsocketConsumer
import json
from chatting.models import ChatRoom, Message
from channels.db import database_sync_to_async
from chatting.serializers import MessageSerializer
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            self.chatroom_id = self.scope["url_route"]["kwargs"]["chatroom_id"]
            self.chatroom = await self.get_chatroom(self.chatroom_id)

            # Kiểm tra quyền truy cập vào phòng chat
            if (
                self.scope["user"]
                not in await sync_to_async(
                    lambda: list(self.chatroom.participants.all())
                )()
            ):
                await self.close()
                return

            # Tham gia phòng chat
            self.room_group_name = f"chat_{self.chatroom_id}"
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            # Gửi thông báo khi kết nối
            await self.accept()
            await self.send(
                text_data=json.dumps(
                    {"message": f"{self.scope['user'].username} đã tham gia phòng chat"}
                )
            )

            # Gửi các tin nhắn hiện có
            messages = await self.get_messages(self.chatroom)
            await self.send(
                text_data=json.dumps(
                    {"type": "chat_messages", "messages": messages},
                    default=str,
                )
            )

        except Exception as e:
            await self.send(text_data=json.dumps({"type": "error", "message": str(e)}))

    async def disconnect(self, close_code):
        # Rời khỏi phòng chat
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json["message"]

        # Lưu tin nhắn vào cơ sở dữ liệu
        saved_message = await self.save_message(
            self.chatroom, self.scope["user"], message_content
        )

        # Lấy tin nhắn gần nhất
        recent_messages = await self.get_messages(self.chatroom)

        # Gửi tin nhắn đến nhóm chat
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "messages": recent_messages}
        )

    async def chat_message(self, event):
        messages = event["messages"]

        try:
            # Gửi tin nhắn đến WebSocket
            await self.send(text_data=json.dumps({"messages": messages}, default=str))
        except Exception as e:
            await self.send(text_data=json.dumps({"type": "error", "message": str(e)}))

    @database_sync_to_async
    def get_chatroom(self, chatroom_id):
        return ChatRoom.objects.get(chatroom_id=chatroom_id)

    @database_sync_to_async
    def save_message(self, chatroom, sender, content):
        message = Message.objects.create(
            chatroom=chatroom, sender=sender, content=content
        )
        return MessageSerializer(message).data

    @database_sync_to_async
    def get_messages(self, chatroom):
        messages = Message.objects.filter(chatroom=chatroom).order_by("-created_at")
        # count = messages.count()
        return MessageSerializer(messages, many=True).data

    @database_sync_to_async
    def get_recent_messages(self, chatroom):
        latest_messages_count = 10
        messages = Message.objects.filter(chatroom=chatroom).order_by("-created_at")[
            :latest_messages_count
        ]
        # messages = Message.objects.filter(chatroom=chatroom).order_by("created_at")
        return MessageSerializer(messages, many=True).data
