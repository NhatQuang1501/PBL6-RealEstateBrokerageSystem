import json
from django.db.models import Q
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.enums import *
from application.models import *
from application.serializers.negotiation_serrializer import *
from application.serializers.post_serializer import *
from application.utils import *
from django.shortcuts import get_object_or_404
from notification.notification_service import NotificationService


class AdminPostView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    # getter = PostGetter()

    def get(self, request, pk=None):
        if pk:
            post = Post.objects.get(post_id=pk)
            if post:
                serializer = PostSerializer(post)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"message": f"Bài đăng {pk} không tồn tại"},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:
            posts = Post.objects.filter(status=Status.PENDING_APPROVAL).order_by("-created_at")
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    # Chức năng duyệt của Admin
    def post(self, request):
        post_id = request.data.get("post_id")
        post_status = request.data.get("status")
        post_status = Status.map_display_to_value(post_status)
        post = Post.objects.get(post_id=post_id)
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
        post = get_object_or_404(Post, post_id=pk)
        deleted_post = post
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
