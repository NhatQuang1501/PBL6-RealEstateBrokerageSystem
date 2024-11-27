from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from accounts.permission import IsAdmin, IsUser
from application.models import Report
from application.serializers.report_serializer import ReportSerializer
from accounts.models import User
from accounts.enums import Status

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
            reported_user = User.objects.filter(user_id=pk).first()
            reportee = User.objects.filter(user_id=pk).first()
            report = Report.objects.filter(report_id=pk).first()
            if reported_user:
                reports = Report.objects.filter(reported_user=reported_user, resolved=False)
                serializer = ReportSerializer(reports, many=True)
                if reports:
                   return Response(serializer.data)
            if reportee:
                reports = Report.objects.filter(reportee=reportee, resolved=False)
                serializer = ReportSerializer(reports, many=True)
                return Response(serializer.data)
            if report:
                serializer = ReportSerializer(report)
                return Response(serializer.data)
        else:
            reports = Report.objects.filter(resolved=False).order_by("-created_at")
            serializer = ReportSerializer(reports, many=True)
            return Response(serializer.data)

    def post(self, request):
        report = ReportSerializer(data=request.data)
        if report.is_valid():
            report.save()
            return Response(report.data, status=status.HTTP_201_CREATED)
        return Response(report.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        report = get_object_or_404(Report, report_id=pk)
        report.resolved = True
        report.save()
        return Response(status=status.HTTP_200_OK)
