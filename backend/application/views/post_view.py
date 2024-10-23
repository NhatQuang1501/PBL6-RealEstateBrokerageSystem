from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from application.serializers import *
from application.utils import PostGetter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.core.paginator import PageNotAnInteger
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from application.utils import *
import time
from django.db.models import Q
import unicodedata
import re


class PostView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, pk=None):
        if pk:
            if User.objects.filter(user_id=pk).exists():
                user = get_object_or_404(User, user_id=pk)
                posts = Post.objects.filter(user_id=user)
                post_serializer = PostSerializer(
                    posts, many=True, context={"request_type": "detail"}
                )

            else:
                post = get_object_or_404(Post, post_id=pk)
                post_serializer = PostSerializer(
                    post, context={"request_type": "detail"}
                )
                data = post_serializer.data

                return Response(data, status=status.HTTP_200_OK)

        else:
            if request.user.is_authenticated:
                user_id = request.user
                query = Q(status=Status.APPROVED)
                posts = Post.objects.filter(query).order_by("updated_at")
            else:
                posts = Post.objects.all().order_by("updated_at")

            post_serializer = PostSerializer(
                posts, many=True, context={"request_type": "list"}
            )

        return Response(post_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        post_data = request.data.copy()
        post_data["user_id"] = request.user.user_id
        post_serializer = PostSerializer(data=post_data)
        # post_serializer = PostSerializer(data=request.data)

        if post_serializer.is_valid():
            post_serializer.save()

            return Response(
                {"message": "Tạo bài đăng thành công", "data": post_serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Tạo bài đăng thất bại", "error": post_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, pk):
        post = get_object_or_404(Post, post_id=pk)
        post_serializer = PostSerializer(post, data=request.data, partial=True)

        if post_serializer.is_valid():
            post_serializer.save()

            return Response(
                {
                    "message": "Cập nhật bài đăng thành công",
                    "data": post_serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"message": "Cập nhật bài đăng thất bại", "error": post_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        post = get_object_or_404(Post, post_id=pk)
        post.delete()

        return Response(
            {"message": "Xoá bài đăng thành công"}, status=status.HTTP_204_NO_CONTENT
        )


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        start_time = time.time()
        params = {key.strip(): value for key, value in request.query_params.items()}
        text = params.get("text").strip()
        if not text:
            text = request.data.get("text")
            print("Text trong request data:", text)

        posts = Post.objects.all()
        posts_serializer = PostSerializer(posts, many=True)
        result = []

        def matches_text(field_value):
            return self.remove_accents(text) in self.remove_accents(field_value)

        for post in posts_serializer.data:
            if any(
                (
                    matches_text(post["estate_type"]),
                    matches_text(post["price"]),
                    matches_text(post["city"]),
                    matches_text(post["district"]),
                    matches_text(post["street"]),
                    matches_text(post["address"]),
                    matches_text(post["orientation"]),
                    matches_text(post["legal_status"]),
                    matches_text(post["description"]),
                    self.search_in_profile(text, post),
                )
            ):
                result.append(post)
                continue

        print("time: ", time.time() - start_time)
        return Response(result, status=status.HTTP_200_OK)

    @staticmethod
    def remove_accents(text):
        text = str(text)
        text = unicodedata.normalize("NFD", text)
        text = re.sub(r"[\u0300-\u036f]", "", text)
        return text.lower()

    @staticmethod
    def search_in_profile(text, post):
        user = post["user_id"]
        user = UserProfile.objects.get(user=user)
        return SearchView.remove_accents(text) in SearchView.remove_accents(
            user.fullname
        )
