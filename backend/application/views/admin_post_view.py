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
from application.serializers import *
from application.utils import PostGetter
from django.shortcuts import get_object_or_404


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

        # self.add_notification(post)
        return Response(
            {
                "message": "Duyệt bài đăng thành công",
            },
            status=status.HTTP_200_OK,
        )

    # def add_notification(self, post):
    #     user_id = post.user_id.id

    #     notification = Notification()
    #     notification.user_id = post.user_id
    #     notification.description = "Bài đăng của bạn đã {}".format(post.status)
    #     notification.read = False
    #     notification.save()

    #     active_connections = cache.get("active_connections", {})

    #     message = json.dumps(
    #         {
    #             "message": "Bài đăng của bạn đã {}".format(post.status),
    #             "time": notification.created_at.strftime("%d/%m/%Y , %H:%M:%S"),
    #         }
    #     )

    #     if str(user_id) in active_connections:
    #         active_connections[str(user_id)].append(message)

    #     cache.set("active_connections", active_connections)
