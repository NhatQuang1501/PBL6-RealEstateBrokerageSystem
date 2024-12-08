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
from application.serializers.post_serializer import *
from friends.models import *
from friends.serializers import *
from chatting.models import *
from chatting.serializers import *
from django.shortcuts import get_object_or_404
from django.db.models import Q


class FriendRequestView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, pk=None):
        if pk:
            # Lấy yêu cầu kết bạn theo id
            friend_request = FriendRequest.objects.filter(friendrequest_id=pk)
            serializer = FriendRequestSerializer(friend_request, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            # Lấy tất cả yêu cầu kết bạn cho người dùng hiện tại
            friend_requests = FriendRequest.objects.filter(
                Q(receiver=request.user) | Q(sender=request.user)
            ).order_by("-created_at")
            serializer = FriendRequestSerializer(friend_requests, many=True)

            return Response(
                {"count": friend_requests.count(), "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def post(self, request):
        receiver_username = request.data.get("receiver")
        if receiver_username == request.user.username:
            return Response(
                {"error": "Bạn không thể tự gửi yêu cầu kết bạn đến chính mình"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        receiver = get_object_or_404(User, username=receiver_username)

        # Đã là bạn bè
        is_friend = Friendship.objects.filter(
            (Q(user1=request.user) & Q(user2=receiver))
            | (Q(user1=receiver) & Q(user2=request.user))
        ).exists()
        if is_friend:
            return Response(
                {"error": "Bạn và người này đã là bạn bè"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Đã có lời mời kết bạn
        pending_request_exists = FriendRequest.objects.filter(
            (
                (Q(sender=request.user) & Q(receiver=receiver))
                | (Q(sender=receiver) & Q(receiver=request.user))
            )
            & Q(friendrequest_status=FriendRequest_status.PENDING)
        ).exists()
        if pending_request_exists:
            return Response(
                {
                    "error": f"Đã tồn tại lời mời kết bạn đang chờ xử lý giữa {request.user.username} và {receiver_username}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        declined_request_exists = FriendRequest.objects.filter(
            (
                Q(sender=request.user) & Q(receiver=receiver)
                | (Q(sender=receiver) & Q(receiver=request.user))
            )
            & (Q(friendrequest_status=FriendRequest_status.DECLINED))
        ).first()
        if declined_request_exists:
            declined_request_exists.delete()

        # Tạo yêu cầu kết bạn mới
        serializer = FriendRequestSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # Lấy friendrequest_id từ dữ liệu yêu cầu
        friendrequest_id = request.data.get("friendrequest_id")
        friendrequest_status = request.data.get("friendrequest_status")
        friendrequest_status = FriendRequest_status.map_display_to_value(
            friendrequest_status
        )

        friend_request = FriendRequest.objects.get(friendrequest_id=friendrequest_id)

        # Kiểm tra xem người dùng hiện tại có phải là người nhận lời mời kết bạn không
        if request.user != friend_request.receiver:
            return Response(
                {
                    "error": "Bạn không có quyền chấp nhận hoặc từ chối lời mời kết bạn này"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        friend_request.friendrequest_status = friendrequest_status

        if friendrequest_status == "đã kết bạn":
            Friendship.objects.get_or_create(
                user1=min(
                    friend_request.sender,
                    friend_request.receiver,
                    key=lambda x: x.user_id,
                ),
                user2=max(
                    friend_request.sender,
                    friend_request.receiver,
                    key=lambda x: x.user_id,
                ),
            )

            # Tạo phòng chat riêng tư cho hai người
            user1 = friend_request.sender
            user2 = friend_request.receiver

            # Kiểm tra xem phòng chat riêng tư giữa hai người đã tồn tại chưa
            if (
                not ChatRoom.objects.filter(is_private=True, participants=user1)
                .filter(participants=user2)
                .exists()
            ):
                chatroom = ChatRoom.objects.create(
                    created_by=user1,
                    is_private=True,
                    chatroom_name=f"{user1.username} & {user2.username}",
                )
                chatroom.participants.set([user1, user2])
                chatroom.save()
                chatroom_serializer = ChatRoomSerializer(chatroom)

            message = f"Đã chấp nhận yêu cầu kết bạn của {user1.username}. Tạo phòng chat riêng tư thành công giữa {user1.username} và {user2.username}"

            friend_request.save()
            serializer = FriendRequestSerializer(friend_request)

            # Thêm thông báo thành công vào phản hồi
            return Response(
                {
                    "message": message,
                    "data": serializer.data,
                    "chatroom-data": chatroom_serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        elif friendrequest_status == "đã từ chối":
            message = f"Đã từ chối yêu cầu kết bạn của {friend_request.sender.username}"

            friend_request.save()
            serializer = FriendRequestSerializer(friend_request)

            return Response(
                {
                    "message": message,
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"error": "Hành động không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, pk):
        # Xóa yêu cầu kết bạn
        friend_request = get_object_or_404(FriendRequest, friendrequest_id=pk)
        if request.user != friend_request.sender:
            return Response(
                {"error": "Bạn không có quyền xóa yêu cầu kết bạn này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if friend_request.friendrequest_status != FriendRequest_status.PENDING:
            return Response(
                {"error": "Chỉ có thể xóa yêu cầu kết bạn khi trạng thái đang chờ"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        receiver_response = friend_request.receiver
        friend_request.delete()

        return Response(
            {"message": f"Xóa lời mời kết bạn đến {receiver_response} thành công"},
            status=status.HTTP_204_NO_CONTENT,
        )


class SentFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Lấy tất cả yêu cầu kết bạn mà người dùng là sender
        friend_requests = FriendRequest.objects.filter(sender=request.user).order_by(
            "-created_at"
        )
        serializer = FriendRequestSerializer(friend_requests, many=True)

        return Response(
            {"count": friend_requests.count(), "data": serializer.data},
            status=status.HTTP_200_OK,
        )


class ReceivedFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Lấy tất cả yêu cầu kết bạn mà người dùng là receiver
        friend_requests = FriendRequest.objects.filter(receiver=request.user).order_by(
            "-created_at"
        )
        serializer = FriendRequestSerializer(friend_requests, many=True)

        return Response(
            {"count": friend_requests.count(), "data": serializer.data},
            status=status.HTTP_200_OK,
        )


class FriendListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, user_id):
        user = get_object_or_404(User, user_id=user_id)

        # Lấy danh sách bạn bè hiện tại từ bảng Friendship
        friendships = Friendship.objects.filter(Q(user1=user) | Q(user2=user)).order_by(
            "-created_at"
        )

        # Tạo danh sách bạn bè từ các mối quan hệ còn tồn tại
        friend_list = []
        for friendship in friendships:
            friend_user = (
                friendship.user2 if friendship.user1 == user else friendship.user1
            )

            # Lấy phòng chat riêng tư giữa user và friend_user
            chatroom = (
                ChatRoom.objects.filter(is_private=True, participants=user)
                .filter(participants=friend_user)
                .first()
            )

            friend_data = {
                "user_id": str(friend_user.user_id),
                "user": {
                    "email": friend_user.email,
                    "username": friend_user.username,
                    "role": friend_user.role,
                    "avatar": (
                        friend_user.profile.avatar.url
                        if friend_user.profile.avatar
                        else None
                    ),
                },
                "chatroom_id": chatroom.chatroom_id if chatroom else None,
            }

            friend_list.append(friend_data)

        return Response(
            {
                "message": f"Danh sách bạn bè của {user.username}",
                "count": len(friend_list),
                "friends": friend_list,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        user = request.user
        friend_user_id = request.data.get("friend_user_id")

        if not friend_user_id:
            return Response(
                {"error": "Hãy cung cấp user_id của người bạn muốn xóa"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        friend_user = get_object_or_404(User, user_id=friend_user_id)

        friendship = Friendship.objects.filter(
            (Q(user1=user) & Q(user2=friend_user))
            | (Q(user1=friend_user) & Q(user2=user))
        ).first()

        if not friendship:
            return Response(
                {"error": "Người dùng này không có trong danh sách bạn bè của bạn"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user not in [friendship.user1, friendship.user2]:
            return Response(
                {"error": "Bạn không có quyền hủy kết bạn trong mối quan hệ này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Xóa quan hệ bạn bè
        friendship.delete()
        FriendRequest.objects.filter(
            (Q(sender=user) & Q(receiver=friend_user))
            | (Q(sender=friend_user) & Q(receiver=user))
        ).delete()

        # Xóa phòng chat riêng tư giữa hai người
        ChatRoom.objects.filter(is_private=True, participants=user).filter(
            participants=friend_user
        ).delete()

        return Response(
            {"message": "Đã hủy kết bạn thành công và xóa phòng chat riêng tư"},
            status=status.HTTP_204_NO_CONTENT,
        )
