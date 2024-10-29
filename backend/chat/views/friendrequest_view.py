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
            )
            serializer = FriendRequestSerializer(friend_requests, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
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
            message = "Đã chấp nhận yêu cầu kết bạn thành công."

        elif friendrequest_status == "đã từ chối":
            message = "Đã từ chối yêu cầu kết bạn thành công."
        else:
            return Response(
                {"error": "Hành động không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST
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
        friend_requests = FriendRequest.objects.filter(sender=request.user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceivedFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Lấy tất cả yêu cầu kết bạn mà người dùng là receiver
        friend_requests = FriendRequest.objects.filter(receiver=request.user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendshipView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request):
        user = request.user

        # Lấy danh sách friend requests mà người dùng đã chấp nhận
        accepted_requests = FriendRequest.objects.filter(
            (models.Q(sender=user) | models.Q(receiver=user)),
            friendrequest_status="đã kết bạn",
        )

        # Tạo danh sách bạn bè
        friend_list = []
        for request in accepted_requests:
            # Thêm vào danh sách nếu chưa tồn tại
            if request.sender == user:
                friend_list.append(request.receiver)
            else:
                friend_list.append(request.sender)

        # Trả về danh sách bạn bè
        return Response(
            {"friends": [friend.username for friend in friend_list]},
            status=status.HTTP_200_OK,
        )
