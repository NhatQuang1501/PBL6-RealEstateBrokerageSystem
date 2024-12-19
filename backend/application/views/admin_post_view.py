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
    getter = PostGetter()

    def get(self, request, pk=None):
        if pk:
            if User.objects.filter(user_id=pk).exists():
                posts = self.getter.get_posts_by_user_id(pk)
            else:
                post_serializer = self.getter.get_posts_by_post_id(pk)

                return Response(post_serializer.data, status="200")
        else:
            status = request.query_params.get("status", "đang chờ duyệt")
            posts = self.getter.get_posts_by_status(request, status).order_by(
                "-created_at"
            )

        return self.getter.paginate_posts(posts, request)

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
            status=status.HTTP_204_NO_CONTENT,
        )
