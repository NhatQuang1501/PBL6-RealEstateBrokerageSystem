from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role

    access_token = refresh.access_token
    access_token = refresh.access_token
    access_token["role"] = user.role
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def send_email_verification(user, request):
    token = RefreshToken.for_user(user)
    token = token.access_token
    token.set_exp(lifetime=timedelta(minutes=10))

    current_site = get_current_site(request).domain
    relativeLink = reverse("email-verify")
    absurl = f"http://{current_site}{relativeLink}?token={str(token)}"

    # absurl = (
    #     f"{request.scheme}://{request.get_host()}/auth/email-verify/?token={str(token)}"
    # )

    subject = "Xác thực tài khoản bạn đã đăng ký tại website SweetHome"

    # Chỉnh sửa cách xây dựng body
    body = (
        f"Xin chào {user.username},\n\n"
        f"Nhấn vào link bên dưới để xác thực tài khoản của bạn:\n{absurl}\n"
        "Cảm ơn vì đã sử dụng website của chúng tôi!"
    )

    # Tạo đối tượng EmailMultiAlternatives
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,  # Đảm bảo rằng bạn đã bật dòng này
        to=[user.email],
    )

    email.send()


def decode_token(token):
    try:
        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(token)
        user_id = validated_token.get("user_id")
        return user_id
    except Exception as e:
        return None


def token_blacklisted(token):
    try:
        refresh_token = RefreshToken(token)
        refresh_token.blacklist()
        return True
    except Exception as e:
        return False
