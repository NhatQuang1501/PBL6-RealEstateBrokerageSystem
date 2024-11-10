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
        if receiver_username == request.user.user_id:

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
            (Q(sender=request.user) & Q(receiver=receiver))
            | (Q(sender=receiver) & Q(receiver=request.user))
        ).exists()
        if pending_request_exists:
            return Response(
                {"error": "Đã tồn tại lời mời kết bạn đang chờ xử lý"},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
            message = "Đã chấp nhận yêu cầu kết bạn thành công"

        elif friendrequest_status == "đã từ chối":
            message = "Đã từ chối yêu cầu kết bạn thành công"

        else:
            return Response(
                {"error": "Hành động không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST
            )

        friend_request.save()

        serializer = FriendRequestSerializer(friend_request)

        # Thêm thông báo thành công vào phản hồi
        return Response(
            {"message": message, "data": serializer.data}, status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        # Xóa yêu cầu kết bạn
        friend_request = get_object_or_404(FriendRequest, friendrequest_id=pk)
        friend_request.delete()

        return Response(
            {"message": "Xóa lời mời kết bạn thành công"},
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
            }

            friend_list.append(friend_data)

        return Response(
            {
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

        return Response(
            {"message": "Đã hủy kết bạn thành công"},
            status=status.HTTP_204_NO_CONTENT,
        )
