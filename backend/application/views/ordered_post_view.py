from rest_framework import status
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
from django.shortcuts import get_object_or_404
from application.utils import *
from django.utils import timezone
from django.db.models import Q, Count
import unicodedata
import re
from datetime import timedelta


class OldestPostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = Q(status=Status.APPROVED)
        posts = Post.objects.filter(query).order_by("created_at")
        post_serializer = PostSerializer(
            posts, many=True, context={"request_type": "list"}
        )

        return Response(
            # {"count": posts.count(), "data": post_serializer.data},
            post_serializer.data,
            status=status.HTTP_200_OK,
        )


class HousePostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = Q(status=Status.APPROVED) & Q(estate_type=EstateType.HOUSE)
        posts = Post.objects.filter(query).order_by("-created_at")
        post_serializer = PostSerializer(
            posts, many=True, context={"request_type": "list"}
        )
        return Response(
            {"count": posts.count(), "data": post_serializer.data},
            status=status.HTTP_200_OK,
        )


class LandPostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = Q(status=Status.APPROVED) & Q(estate_type=EstateType.LAND)
        posts = Post.objects.filter(query).order_by("-created_at")
        post_serializer = PostSerializer(
            posts, many=True, context={"request_type": "list"}
        )

        return Response(
            {"count": posts.count(), "data": post_serializer.data},
            status=status.HTTP_200_OK,
        )


class HighlightedPostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Lấy trong 6 tháng gần nhất
        recent_months = 6
        current_date = timezone.now()
        start_date = current_date - timedelta(days=recent_months * 30)

        posts = (
            Post.objects.filter(status=Status.APPROVED, created_at__gte=start_date)
            .annotate(
                reaction_count=Count("postreaction"),
                comment_count=Count("postcomment"),
                # negotiation_count=models.F("negotiation_count"),
                # save_count=models.F("save_count"),
            )
            .annotate(
                highlight_score=(
                    0.3 * Count("postreaction")  # Trọng số cho reactions
                    + 0.7 * Count("postcomment")  # Trọng số cho comments
                    + 0.1 * models.F("view_count")  # Trọng số cho view_count
                    # + 1 * models.F("negotiation_count")  # Trọng số cho negotiation_count
                    # + 0.5 * models.F("save_count")  # Trọng số cho save_count
                )
            )
            .order_by("-highlight_score", "-created_at")
        )

        post_serializer = PostSerializer(posts, many=True)

        return Response(
            {"count": posts.count(), "data": post_serializer.data},
            status=status.HTTP_200_OK,
        )
