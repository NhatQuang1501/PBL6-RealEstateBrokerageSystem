from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from backend.application.serializers.post_serializer import *
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


class StatisticView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        query = Q(status=Status.APPROVED)
        posts = Post.objects.filter(query).order_by("-created_at")
        post_serializer = PostSerializer(
            posts, many=True, context={"request_type": "list"}
        )
        return Response(
            {"count": posts.count(), "data": post_serializer.data},
            status=status.HTTP_200_OK,
        )
