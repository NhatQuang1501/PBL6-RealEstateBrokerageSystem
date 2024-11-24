from django.shortcuts import get_object_or_404
from accounts.enums import *
from accounts.models import *
from application.models import *
from application.serializers.post_serializer import *
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class PostGetter:
    def get_posts_by_user_id(self, user_id):
        status = Status.PENDING_APPROVAL
        user = get_object_or_404(User, user_id=user_id)
        posts = Post.objects.filter(user_id=user, status=status).order_by("-created_at")

        return posts

    def get_posts_by_post_id(self, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        post_serializer = PostSerializer(post, context={"request_type": "detail"})

        return post_serializer

    def get_posts_by_status(self, request, status):
        if status == "đang chờ duyệt":
            status = Status.PENDING_APPROVAL
        elif status == "đã duyệt":
            status = Status.APPROVED
        elif status == "bị từ chối":
            status = Status.REJECTED
        elif status == "đã đóng":
            status = Status.CLOSED

        # posts = Post.objects.filter(status=status).order_by("-created_at")
        posts = Post.objects.filter(status=status)

        return posts

    def paginate_posts(self, posts, request, type="detail"):
        paginator = CustomPagination()
        paginated_posts = paginator.paginate_queryset(posts, request)
        post_serializer = PostSerializer(
            paginated_posts, many=True, context={"request_type": type}
        )

        return paginator.get_paginated_response(post_serializer.data)
