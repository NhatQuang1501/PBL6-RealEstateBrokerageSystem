from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from application.models import *
from application.serializers import *
from application.utils import PostGetter
from rest_framework.response import Response
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from friends.models import *
from friends.serializers import *
from friends.views import *
from .models import ChatRoom, Message
from chatting.serializers import *
from django.shortcuts import get_object_or_404
from django.utils import timezone
from application.utils import *
from django.db.models import Q, Count, F
from datetime import timedelta


# APIView cho ChatRoom
class ChatRoomView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, chatroom_id=None):
        if chatroom_id:
            """Lấy thông tin chi tiết phòng chat"""
            chatroom = get_object_or_404(ChatRoom, chatroom_id=chatroom_id)

            # Kiểm tra quyền tham gia
            if request.user not in chatroom.participants.all():
                return Response(
                    {"message": "Bạn không phải là thành viên trong phòng chat này"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serializer = ChatRoomSerializer(chatroom)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            """Lấy danh sách tất cả các phòng chat mà user đã tham gia"""
            params = {key.strip(): value for key, value in request.query_params.items()}
            user_id = params.get("user_id").strip()
            user = User.objects.get(user_id=user_id)

            chatrooms = ChatRoom.objects.filter(participants__in=[user]).distinct()
            serializer = ChatRoomSerializer(chatrooms, many=True)

            return Response(
                {"count": chatrooms.count(), "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def post(self, request):
        """Tạo một phòng chat mới."""
        data = request.data
        is_private = data.get("is_private", False)
        participants = data.get("participants", [])

        if is_private:
            # Xử lý khi tạo phòng chat riêng tư (2 người bạn)
            if len(participants) != 1:
                return Response(
                    {"message": "Phòng chat riêng tư chỉ có thể có 2 người."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user1 = request.user
            user2 = User.objects.get(user_id=participants[0])

            # Kiểm tra xem họ đã là bạn bè chưa
            if (
                Friendship.objects.filter(user1=user1, user2=user2).exists()
                or Friendship.objects.filter(user1=user2, user2=user1).exists()
            ):
                chatroom = ChatRoom.objects.create(created_by=user1, is_private=True)
                chatroom.participants.set([user1, user2])
                chatroom.save()
                serializer = ChatRoomSerializer(chatroom)

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            else:
                return Response(
                    {"message": "Hai người dùng chưa là bạn bè"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Tạo phòng chat nhóm
        chatroom = ChatRoom.objects.create(
            created_by=request.user,
            is_private=False,
            chatroom_name=data.get("chatroom_name", "Group Chat"),
        )

        # Kiểm tra từng participant xem họ có phải là bạn bè của người tạo hay không
        valid_participants = [request.user]
        for participant_id in participants:
            try:
                participant = User.objects.get(user_id=participant_id)
                if (
                    Friendship.objects.filter(
                        user1=request.user, user2=participant
                    ).exists()
                    or Friendship.objects.filter(
                        user1=participant, user2=request.user
                    ).exists()
                ):
                    valid_participants.append(participant)
                else:
                    return Response(
                        {
                            "message": f"User {participant.username} chưa là bạn bè với bạn"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except User.DoesNotExist:
                return Response(
                    {"message": f"User với id {participant_id} không tồn tại."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        chatroom.participants.set(valid_participants)
        chatroom.save()
        serializer = ChatRoomSerializer(chatroom)

        return Response(
            {
                "message": "Tạo phòng chat mới thành công",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, chatroom_id):
        """Xóa phòng chat"""
        chatroom = get_object_or_404(ChatRoom, chatroom_id=chatroom_id)

        # Chỉ cho phép xóa nếu là chatroom nhiều người
        if chatroom.is_private:
            return Response(
                {"message": "Không thể xóa phòng chat riêng tư"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Chỉ cho phép xóa nếu user là người tạo
        if request.user != chatroom.created_by:
            return Response(
                {"message": "Bạn không thể xóa phòng chat này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        chatroom.delete()

        return Response(
            {"message": "Xóa phòng chat thành công"}, status=status.HTTP_204_NO_CONTENT
        )


class MessageView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request, pk):
        if ChatRoom.objects.filter(chatroom_id=pk).exists():
            """Lấy tất cả tin nhắn trong một phòng chat"""
            chatroom = get_object_or_404(ChatRoom, chatroom_id=pk)

            # Kiểm tra quyền tham gia
            if request.user not in chatroom.participants.all():
                return Response(
                    {"message": "Bạn không phải là thành viên trong phòng chat này"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            messages = Message.objects.filter(chatroom=chatroom).order_by("created_at")
            serializer = MessageSerializer(messages, many=True)

            return Response(
                {"count": messages.count(), "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        elif Message.objects.filter(message_id=pk).exists():
            """Lấy thông tin chi tiết một tin nhắn"""
            message = get_object_or_404(Message, message_id=pk)

            # Kiểm tra quyền tham gia
            if request.user not in message.chatroom.participants.all():
                return Response(
                    {"message": "Bạn không phải là thành viên trong phòng chat này"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serializer = MessageSerializer(message)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(
                {"error": "Không tìm thấy tin nhắn hoặc phòng chat"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, pk):
        """Gửi một tin nhắn vào phòng chat"""
        chatroom = get_object_or_404(ChatRoom, chatroom_id=pk)

        # Kiểm tra quyền tham gia
        if request.user not in chatroom.participants.all():
            return Response(
                {"message": "Bạn không phải là thành viên trong phòng chat này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data
        data["chatroom"] = chatroom.chatroom_id
        data["sender"] = request.user.user_id

        serializer = MessageSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )
