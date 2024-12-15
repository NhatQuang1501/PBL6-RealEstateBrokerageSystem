from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from notification.models import *
from notification.serializers import *
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count, F
from datetime import timedelta, datetime


class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, notification_id=None):
        if notification_id:
            notification = get_object_or_404(
                Notification, notification_id=notification_id
            )
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            notifications = Notification.objects.filter(user=request.user).order_by(
                "-created_at"
            )
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
