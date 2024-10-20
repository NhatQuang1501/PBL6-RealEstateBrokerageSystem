import jwt
from django.conf import settings
from rest_framework import status, serializers, views
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import *
from .models import *
from .utils import *
import logging
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .permission import *
from rest_framework.permissions import IsAuthenticated
from django.views.generic import View
from django.shortcuts import render
from rest_framework_simplejwt.tokens import AccessToken


class BaseView(APIView):
    model = None
    serializer = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, pk=None):
        if pk:
            user = get_object_or_404(User, user_id=pk)
            instance = get_object_or_404(self.model, user=user)
            serializer = self.serializer(instance)

        else:
            instances = self.model.objects.all()
            serializer = self.serializer(instances, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):
        user = get_object_or_404(User, user_id=pk)
        instance = get_object_or_404(self.model, user=user)
        serializer = self.serializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = get_object_or_404(User, user_id=pk)
        user.delete()

        return Response(
            {"message": "Xóa thành công"}, status=status.HTTP_204_NO_CONTENT
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Lấy thông tin người dùng trực tiếp từ request.data thay vì từ "user"
        user_data = request.data

        if not user_data:
            return Response(
                {"message": "Nhập thông tin tài khoản người dùng"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra vai trò hợp lệ
        role = user_data.get("role")
        if role not in ["user", "admin"]:
            return Response(
                {"message": "Vai trò không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Lựa chọn serializer dựa trên vai trò
        if role == "user":
            serializer = UserProfileSerializer(data=user_data)  # Sử dụng user_data
        elif role == "admin":
            serializer = UserSerializer(data=user_data)  # Sử dụng user_data

        # Kiểm tra dữ liệu hợp lệ
        if serializer.is_valid():
            user = serializer.save()

            if role == "user":
                # Gửi email xác thực cho người dùng
                try:
                    send_email_verification(user, request)
                except Exception as e:
                    # Xoá người dùng nếu gửi email thất bại
                    user.delete()
                    return Response(
                        {"message": "Gửi email xác thực thất bại", "error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                return Response(
                    {
                        "message": "Đã tạo tài khoản. Bạn cần xác thực email để sử dụng tài khoản",
                        "data": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )

            # Nếu là admin, không cần xác thực email
            user.is_verified = True
            user.save()

            return Response(
                {
                    "message": "Đã tạo tài khoản admin thành công",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", None)
        username = request.data.get("username", None)
        password = request.data.get("password", None)

        try:
            if email:
                user = User.objects.filter(Q(email=email)).first()
            elif username:
                user = User.objects.filter(Q(username=username)).first()
            else:
                return Response(
                    {"message": "Nhập email hoặc username"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if user and user.check_password(password):
                if user.is_verified == False:
                    return Response(
                        {"message": "Email chưa được xác thực"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                token = get_tokens_for_user(user)
                role = user.role

                # Check nếu người dùng có role 'user'
                if role == "user":
                    user = UserProfile.objects.get(user=user)
                    serializer = UserProfileSerializer(user)
                elif role == "admin":
                    serializer = UserSerializer(user)

                return Response(
                    {
                        "message": "Đăng nhập thành công",
                        "data": serializer.data,
                        "tokens": token,
                        "role": role,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"message": "Thông tin đăng nhập không chính xác"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh", None)
            if token_blacklisted(refresh_token):
                return Response({"message": "Đã đăng xuất"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyEmailView(View):
    def get(self, request):
        token = request.GET.get("token", None)
        if token is None:
            return Response(
                {"message": "Hãy cung cấp token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login_redirect_url = request.build_absolute_uri("/auth/login/")
        re_verify_url = request.build_absolute_uri("/auth/email-reverify/")

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = User.objects.get(user_id=user_id)
            user.is_verified = True
            user.save()

            return render(
                request,
                "account_activation.html",
                context={"redirect_url": login_redirect_url},
            )
        except Exception as e:
            return render(
                request,
                "activation_failed.html",
                context={"re_verify_url": re_verify_url, "error": str(e)},
            )


class ReverifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get("email", None)
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response(
                    {"message": "Tài khoản đã được xác thực"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            else:
                send_email_verification(user, request)
                login_redirect_url = request.build_absolute_uri("/login/")
                return Response(
                    {
                        "message": "Email xác thực đã được gửi",
                        "redirect_url": login_redirect_url,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserView(BaseView):
    model = UserProfile
    serializer = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsUser]
