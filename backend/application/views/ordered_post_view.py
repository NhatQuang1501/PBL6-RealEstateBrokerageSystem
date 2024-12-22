from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from application.serializers.post_serializer import *
from application.utils import PostGetter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from django.shortcuts import get_object_or_404
from application.utils import *
from django.utils import timezone
from django.db.models import Q, Count, F
import unicodedata
import re
from datetime import timedelta


class SavePostView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get(self, request, pk):
        # pk là user_id
        user = get_object_or_404(User, user_id=pk)
        saved_posts = (
            SavedPost.objects.filter(user=user)
            .select_related("post")
            .order_by("-created_at")
        )

        posts = [saved_post.post for saved_post in saved_posts]
        post_serializer = PostSerializer(posts, many=True)

        return Response(
            # {"count": len(posts), "data": post_serializer.data},
            post_serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request, pk):
        # pk là post_id
        user = request.user
        post = get_object_or_404(Post, post_id=pk)

        if post.status != Status.APPROVED:
            return Response(
                {"detail": "Chỉ có thể lưu các bài đăng đã được duyệt"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra nếu người dùng đang cố gắng lưu bài của chính mình
        if post.user_id == user:
            return Response(
                {"detail": "Bạn không thể tự lưu bài đăng của chính mình"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra nếu đã lưu trước đó
        if SavedPost.objects.filter(user=user, post=post).exists():
            return Response(
                {"detail": "Bài đã được lưu"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        SavedPost.objects.create(user=user, post=post)
        # Tăng save_count của bài đăng
        Post.objects.filter(post_id=pk).update(save_count=F("save_count") + 1)

        return Response(
            {"detail": "Bài đăng đã được lưu thành công vào danh sách của bạn"},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, pk):
        user = request.user
        post = get_object_or_404(Post, post_id=pk)

        # Kiểm tra nếu bài đăng chưa được lưu trước đó
        saved_post = SavedPost.objects.filter(user=user, post=post).first()
        if not saved_post:
            return Response(
                {"detail": "Bài đăng chưa được lưu"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_post.delete()
        # Giảm số lần lưu của bài đăng
        Post.objects.filter(post_id=pk).update(save_count=F("save_count") - 1)

        return Response(
            {"detail": "Đã xóa bài đăng khỏi danh sách đã lưu"},
            status=status.HTTP_200_OK,
        )
