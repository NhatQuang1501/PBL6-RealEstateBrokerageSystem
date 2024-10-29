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
from chat.models import *
from chat.serializers import *
from chat.views.friendrequest_view import *
from django.shortcuts import get_object_or_404
from django.db.models import Q


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, receiver_username=None):
        if receiver_username:
            sender = request.user
            receiver = get_object_or_404(User, username=receiver_username)

            # Kiểm tra tình trạng kết bạn
            friendship_exists = Friendship.objects.filter(
                (Q(user1=sender) & Q(user2=receiver))
                | (Q(user1=receiver) & Q(user2=sender))
            ).exists()

            if not friendship_exists:
                return Response(
                    {"error": "Bạn chỉ có thể xem tin nhắn với bạn bè"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Danh sách tin nhắn giữa sender và receiver
            chat_messages = ChatMessage.objects.filter(
                (Q(sender=sender) & Q(receiver=receiver))
                | (Q(sender=receiver) & Q(receiver=sender))
            ).order_by("created_at")

        else:
            chat_messages = ChatMessage.objects.filter(
                Q(sender=request.user) | Q(receiver=request.user)
            ).order_by("created_at")

        serializer = ChatMessageSerializer(chat_messages, many=True)

        return Response(
            {
                "message_count": chat_messages.count(),  # Thêm số lượng tin nhắn vào phản hồi
                "messages": serializer.data,  # Dữ liệu tin nhắn
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        sender = request.user
        receiver_username = request.data.get("receiver_username")
        message = request.data.get("message")

        # Kiểm tra xem receiver có là bạn của sender không
        receiver = get_object_or_404(User, username=receiver_username)
        friendship_exists = Friendship.objects.filter(
            (Q(user1=sender) & Q(user2=receiver))
            | (Q(user1=receiver) & Q(user2=sender))
        ).exists()

        if not friendship_exists:
            return Response(
                {"error": "Bạn chỉ có thể gửi tin nhắn với bạn bè"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Tạo tin nhắn
        chat_message = ChatMessage.objects.create(
            sender=sender, receiver=receiver, message=message
        )

        serializer = ChatMessageSerializer(chat_message)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, message_id=None):
        sender = request.user
        # Lấy tin nhắn dựa trên message_id và kiểm tra người gửi
        chat_message = get_object_or_404(
            ChatMessage, message_id=message_id, sender=sender
        )

        # Chỉ xóa nếu người dùng là sender của tin nhắn
        if chat_message.sender == sender:
            chat_message.delete()
            return Response(
                {"message": "Tin nhắn đã được xóa thành công."},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"error": "Bạn không có quyền xóa tin nhắn này."},
                status=status.HTTP_403_FORBIDDEN,
            )


class SearchUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request):
        query = request.query_params.get("query")
        users = User.objects.filter(username__icontains=query)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
