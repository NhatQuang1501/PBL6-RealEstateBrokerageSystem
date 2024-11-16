from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from accounts.enums import *
from accounts.models import *
from accounts.serializers import *
from accounts.permission import *
from application.models import *
from application.serializers import *
from friends.models import *
from friends.serializers import *
from chat.models import *
from chat.serializers import *
from chat.views import *
from django.shortcuts import get_object_or_404
from django.db.models import Q


class ChatRoomView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get(self, request, chatroom_id=None):
        try:
            if chatroom_id:
                chatroom = ChatRoom.objects.get(chatroom_id=uuid.UUID(chatroom_id))
                serializer = ChatRoomSerializer(chatroom)
                return Response(serializer.data, status=status.HTTP_200_OK)

            else:
                chatrooms = ChatRoom.objects.all()
                serializer = ChatRoomSerializer(chatrooms, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chatroom không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        user1_id = request.data.get("user1_id")
        user2_id = request.data.get("user2_id")

        try:
            user1 = User.objects.get(user_id=uuid.UUID(user1_id))
            user2 = User.objects.get(user_id=uuid.UUID(user2_id))

        except User.DoesNotExist:
            return Response(
                {"error": "Không tìm thấy User"}, status=status.HTTP_404_NOT_FOUND
            )

        # Kiểm tra phòng chat đã tồn tại chưa
        chatroom, created = ChatRoom.objects.get_or_create(user1=user1, user2=user2)

        return Response(
            {"chatroom_id": str(chatroom.chatroom_id), "created": created},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, chatroom_id=None):
        try:
            chatroom = ChatRoom.objects.get(chatroom_id=uuid.UUID(chatroom_id))
            chatroom.delete()
            return Response(
                {"message": "Xóa chatroom thành công"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chatroom không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )


class MessageView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request, chatroom_id=None):
        try:
            chatroom = ChatRoom.objects.get(chatroom_id=uuid.UUID(chatroom_id))
            messages = Message.objects.filter(chatroom=chatroom).order_by("-created_at")
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chatroom không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )

    # POST: Gửi tin nhắn
    def post(self, request):
        chatroom_id = request.data.get("chatroom_id")
        sender_id = request.data.get("sender_id")
        message_text = request.data.get("message")

        try:
            chatroom = ChatRoom.objects.get(chatroom_id=uuid.UUID(chatroom_id))
            sender = User.objects.get(user_id=uuid.UUID(sender_id))
        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chatroom không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )

        # Lưu tin nhắn vào cơ sở dữ liệu
        message = Message.objects.create(
            chatroom=chatroom, sender=sender, text=message_text
        )

        return Response(
            {
                "message_id": str(message.message_id),
                "message": message.text,
                "sender_id": str(sender.user_id),
                "created_at": message.created_at.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, message_id=None):
        try:
            message = Message.objects.get(message_id=uuid.UUID(message_id))
            message.delete()
            return Response(
                {"message": "Xóa tin nhắn thành công"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Message.DoesNotExist:
            return Response(
                {"error": "Tin nhắn không tìm thấy"}, status=status.HTTP_404_NOT_FOUND
            )
