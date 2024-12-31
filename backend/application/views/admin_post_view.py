import json
from django.db.models import Q, F
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.permission import IsAdmin
from accounts.models import User
from accounts.enums import Status, NotificationType
from application.models import Post
from application.serializers.post_serializer import PostSerializer
from django.shortcuts import get_object_or_404
from notification.notification_service import NotificationService


class AdminPostView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk=None):
        if pk:
            post = Post.objects.select_related("user_id").get(post_id=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            posts = (
                Post.objects.filter(status=Status.PENDING_APPROVAL)
                .select_related("user_id")
                .order_by("-created_at")
            )
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        post_id = request.data.get("post_id")
        post_status = request.data.get("status")
        post_status = Status.map_display_to_value(post_status)
        post = (
            Post.objects.select_related("user_id")
            .only("post_id", "status", "user_id")
            .get(post_id=post_id)
        )
        post.status = post_status
        post.save()

        author = post.user_id
        author_noti = f"Bài đăng của bạn {post_status}"
        additional_info = {
            "type": NotificationType.ADMINPOST,
            "post_id": str(post_id),
        }
        NotificationService.add_notification(author, author_noti, additional_info)

        return Response(
            {
                "message": f"{'Duyệt' if post_status == Status.APPROVED else 'Từ chối duyệt'} bài đăng thành công",
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        post = get_object_or_404(
            Post.objects.select_related("user_id").only("post_id", "title", "user_id"),
            post_id=pk,
        )
        post_id = post.post_id
        post_title = post.title
        author = post.user_id
        post.delete()

        author_noti = f"Bài đăng {post_title} của bạn đã bị xóa bởi admin"
        additional_info = {
            "type": "delete" + NotificationType.ADMINPOST,
            "post_title": str(post_title),
        }
        NotificationService.add_notification(author, author_noti, additional_info)

        return Response(
            {"message": f"Xóa bài đăng {post_id} - {post_title} thành công"},
            status=status.HTTP_200_OK,
        )
