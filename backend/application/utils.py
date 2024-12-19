from django.shortcuts import get_object_or_404
from accounts.enums import *
from accounts.models import *
from application.models import *
from application.serializers.post_serializer import *
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from datetime import timedelta


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class PaginatedAPIView(APIView):
    pagination_class = CustomPagination

    def get_paginated_response(self, queryset, request, serializer_class):
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = serializer_class(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class PostGetter:
    def get_posts_by_user_id(self, user_id):
        status = Status.PENDING_APPROVAL
        user = get_object_or_404(User, user_id=user_id)
        posts = Post.objects.filter(
            user_id=user, status=status).order_by("-created_at")

        return posts

    def get_posts_by_post_id(self, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        post_serializer = PostSerializer(
            post, context={"request_type": "detail"})

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


def calculate_average_response_time(response_times):
    if not response_times:
        return None

    total_time = sum(
        (response_times[i] - response_times[i - 1]).total_seconds()
        for i in range(1, len(response_times))
    )
    average_time = total_time / (len(response_times) - 1)

    return timedelta(seconds=average_time)
