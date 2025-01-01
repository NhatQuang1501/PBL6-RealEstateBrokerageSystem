from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.permission import IsAdmin, IsUser
from application.models import Report
from application.serializers.report_serializer import ReportSerializer
from accounts.models import User
from accounts.enums import *
from notification.notification_service import NotificationService
from django.db.models import Q, F


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "PUT":
            self.permission_classes = [IsAdmin]
        if self.request.method == "GET":
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]

    def get(self, request, pk=None):
        if pk:
            reports = Report.objects.filter(
                Q(reported_user__user_id=pk) | Q(reportee__user_id=pk) | Q(report_id=pk)
            ).select_related("reported_user", "reportee", "post", "comment")
            if not reports.exists():
                return Response(
                    {"message": "Không tìm thấy báo cáo"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = ReportSerializer(reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            reports = (
                Report.objects.filter(resolved=False)
                .select_related("reported_user", "reportee", "post", "comment")
                .order_by("-created_at")
            )
            serializer = ReportSerializer(reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        report = ReportSerializer(data=request.data)
        if report.is_valid():
            report.save()

            admins = User.objects.filter(role=Role.ADMIN)
            for admin in admins:
                report_id = report.data["report_id"]
                reportee_id = report.data["reportee_id"]
                reportee_name = report.data["reportee_name"]
                reportee_avatar = report.data["reportee_avt"]
                reported_user_name = report.data["reported_user_name"]
                report_type = report.data["report_type"]
                admin_noti = (
                    f"{reportee_name} báo cáo người dùng {reported_user_name}"
                    if report_type == ReportType.USER
                    else f"{reportee_name} báo cáo {report_type} của {reported_user_name}"
                )

                additional_info = {
                    "type": NotificationType.REPORT,
                    "report_id": str(report_id),
                    "reportee_id": str(reportee_id),
                    "reportee_name": str(reportee_name),
                    "reportee_avatar": reportee_avatar,
                    "reported_user_name": str(reported_user_name),
                    "report_type": report_type,
                }
                NotificationService.add_notification(admin, admin_noti, additional_info)

            return Response(report.data, status=status.HTTP_201_CREATED)
        return Response(report.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        report = get_object_or_404(Report, report_id=pk)
        report.resolved = True
        reported_user = report.reported_user
        reported_user.profile.reputation_score = F("reputation_score") - 10
        report.save()
        reported_user.profile.save()
        return Response(status=status.HTTP_200_OK)
