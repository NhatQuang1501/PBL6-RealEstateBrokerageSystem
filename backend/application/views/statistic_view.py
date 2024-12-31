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
from application.views.chart_helper import ChartHelper
from django.db.models import Count, Q, Sum, F
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear


class StatisticView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    chart_helper = ChartHelper()

    def get(self, request):
        category = request.query_params.get("category", None)
        period = request.query_params.get("period", None)

        if category == "users_summary":
            return Response(self.get_users_summary(), status=status.HTTP_200_OK)
        elif category == "new_users_statistics":
            return Response(
                self.get_new_users_statistics(period), status=status.HTTP_200_OK
            )
        elif category == "posts_summary":
            return Response(self.get_posts_summary(), status=status.HTTP_200_OK)
        elif category == "new_posts_statistics":
            return Response(
                self.get_new_posts_statistics(period), status=status.HTTP_200_OK
            )
        elif category == "interactions_summary":
            return Response(self.get_interactions_summary(), status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST
            )

    def get_users_summary(self):
        total_users = User.objects.count()
        banned_users = User.objects.filter(is_active=False).count()
        return {
            "total_users": total_users,
            "banned_users": banned_users,
        }

    def get_new_users_statistics(self, period):
        return {
            "new_users": self.chart_helper.get_new_users(period),
        }

    def get_posts_summary(self):
        total_posts = self.chart_helper.get_total_posts()
        violated_posts = self.chart_helper.get_violated_posts()
        house_posts = Post.objects.filter(estate_type=EstateType.HOUSE, status=Status.APPROVED).count()
        land_posts = Post.objects.filter(estate_type=EstateType.LAND, status=Status.APPROVED).count()
        return {
            "total_posts": total_posts,
            "rejected_posts": violated_posts,
            "house_posts": house_posts,
            "land_posts": land_posts,
        }

    def get_new_posts_statistics(self, period):
        return {
            "new_posts": self.chart_helper.get_new_posts(period),
        }

    def get_interactions_summary(self):
        return self.chart_helper.get_interactions_summary()
