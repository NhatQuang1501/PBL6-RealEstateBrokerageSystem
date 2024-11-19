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
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


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

            if user.role == "admin":
                instance = get_object_or_404(self.model, user=user)
                serializer = self.admin_serializer(instance)
                admin_data = serializer.data
                admin_data["user_id"] = str(user.user_id)  # Thêm user_id cho admin

                return Response(admin_data, status=status.HTTP_200_OK)

            else:
                instance = get_object_or_404(self.model, user=user)
                serializer = self.serializer(instance)

                return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            # Lấy tất cả người dùng từ hệ thống
            users = User.objects.all().order_by("-created_at")

            # Tạo danh sách kết quả chứa từng người dùng với serializer tương ứng
            results = []
            for user in users:
                if user.role == "admin":
                    serializer = self.admin_serializer(user)
                    admin_data = serializer.data
                    admin_data["user_id"] = str(user.user_id)  # Thêm user_id cho admin
                    results.append(admin_data)

                else:
                    instance = get_object_or_404(self.model, user=user)
                    serializer = self.serializer(instance)
                    results.append(serializer.data)

            return Response(
                # {"count": len(results), "data": results},
                results,
                status=status.HTTP_200_OK,
            )

    def put(self, request, pk):
        user = get_object_or_404(User, user_id=pk)
        instance = get_object_or_404(self.model, user=user)
        serializer = self.serializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Cập nhật thông tin người dùng thành công",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Cập nhật thông tin người dùng thất bại",
                "error": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        user = get_object_or_404(User, user_id=pk)
        user.delete()

        return Response(
            {"message": "Xóa người dùng thành công"}, status=status.HTTP_204_NO_CONTENT
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]
    default_error_message = {
        "username": "Username phải chứa ít nhất một ký tự chữ cái",
        "password": "Password phải chứa ít nhất một ký tự chữ cái",
        "email_exists": "Email đã được sử dụng.",
        "username_exists": "Username đã được sử dụng.",
    }

    def post(self, request):
        # Lấy thông tin người dùng trực tiếp từ từ key "user"
        user_data = request.data.get("user")

        if not user_data:
            return Response(
                {"message": "Nhập thông tin tài khoản người dùng"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra xem username và password có chứa ký tự chữ cái không
        if not any(char.isalpha() for char in user_data.get("username", "")):
            return Response(
                {"error": self.default_error_message["username"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not any(char.isalpha() for char in user_data.get("password", "")):
            return Response(
                {"error": self.default_error_message["password"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra xem email và username đã tồn tại chưa
        if User.objects.filter(email=user_data.get("email")).exists():
            return Response(
                {"error": self.default_error_message["email_exists"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=user_data.get("username")).exists():
            return Response(
                {"error": self.default_error_message["username_exists"]},
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
            serializer = UserProfileSerializer(
                data=request.data
            )  # Sử dụng request.data vì được bọc trong key "user" để tạo profile
        elif role == "admin":
            serializer = UserSerializer(
                data=user_data
            )  # Sử dụng user_data như bình thường

        # Kiểm tra dữ liệu hợp lệ
        if serializer.is_valid():
            user = serializer.save()

            if role == "user":
                # Gửi email xác thực cho người dùng
                try:
                    user = user.user
                    send_email_verification(user, request)
                except Exception as e:
                    # Xoá người dùng nếu gửi email thất bại
                    User.objects.get(user_id=user.user_id).delete()
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
        # Lấy thông tin email, username và password từ request
        email_or_username = request.data.get("username", None)
        password = request.data.get("password", None)

        if not email_or_username and not password:
            return Response(
                {"message": "Hãy nhập email hoặc username và mật khẩu để đăng nhập"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email_or_username:
            return Response(
                {"message": "Hãy nhập email hoặc username"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:
            return Response(
                {"message": "Hãy nhập mật khẩu"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Tìm người dùng theo email hoặc username
            user = User.objects.filter(
                Q(email=email_or_username) | Q(username=email_or_username)
            ).first()

            # Kiểm tra nếu tìm thấy người dùng và mật khẩu đúng
            if user and user.check_password(password):
                if not user.is_verified:
                    return Response(
                        {"message": "Email chưa được xác thực"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                token = get_tokens_for_user(user)
                role = user.role

                # Check role của người dùng
                if role == "user":
                    user_profile = UserProfile.objects.get(user=user)
                    serializer = UserProfileSerializer(user_profile)
                elif role == "admin":
                    serializer = UserSerializer(user)

                # Trả về thông tin đăng nhập thành công cùng với token
                return Response(
                    {
                        "message": "Đăng nhập thành công",
                        "data": serializer.data,
                        "role": role,
                        "tokens": token,
                    },
                    status=status.HTTP_200_OK,
                )

            # Nếu thông tin không chính xác
            return Response(
                {"message": "Thông tin đăng nhập không chính xác"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh", None)
            if token_blacklisted(refresh_token):
                return Response({"message": "Đã đăng xuất"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # def post(self, request):
    #     try:
    #         refresh_token = request.data.get("refresh", None)
    #         if refresh_token is None:
    #             return Response(
    #                 {"message": "Token refresh không được cung cấp"},
    #                 status=status.HTTP_400_BAD_REQUEST,
    #             )

    #         # Kiểm tra và blacklist token refresh
    #         token = RefreshToken(refresh_token)
    #         token.blacklist()

    #         return Response({"message": "Đã đăng xuất"}, status=status.HTTP_200_OK)
    #     except TokenError as e:
    #         return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         return Response(
    #             {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )


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
    admin_serializer = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOrUser]


class AvatarView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def post(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)

        serializers = UserProfileSerializer(
            user_profile, data=request.data, partial=True
        )
        if serializers.is_valid():
            serializers.save()
            avatar_url = request.build_absolute_uri(serializers.instance.avatar.url)
            return Response(
                {"message": "Avatar đã được cập nhật", "avatar_url": avatar_url},
                status=status.HTTP_200_OK,
            )

    def get(self, request, pk=None):
        user = request.user
        if pk:
            user = get_object_or_404(User, user_id=pk)
        user_profile = UserProfile.objects.get(user=user)
        avatar_url = request.build_absolute_uri(user_profile.avatar.url)
        return Response(
            {"avatar_url": avatar_url},
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        serializers = UserProfileSerializer(
            user_profile, data=request.data, partial=True
        )
        if serializers.is_valid():
            serializers.save()
            avatar_url = request.build_absolute_uri(serializers.instance.avatar.url)
            return Response(
                {"message": "Avatar đã được cập nhật", "avatar_url": avatar_url},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Cập nhật avatar thất bại", "error": serializers.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        user_profile.avatar.delete(save=True)
        return Response(
            {"message": "Avatar đã được xóa"},
            status=status.HTTP_204_NO_CONTENT,
        )
