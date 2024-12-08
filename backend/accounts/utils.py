from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from accounts.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from accounts.serializers import *
from accounts.models import *
from threading import Thread
import logging

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role

    access_token = refresh.access_token
    access_token["role"] = user.role
    return {
        "refresh": str(refresh),
        "access": str(access_token),
    }


def send_email_async(user, subject, body):
    def send():
        email = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=settings.EMAIL_HOST_USER,
            to=[user.email],
        )
        email.send()

    Thread(target=send).start()


def send_email_verification(user, request):
    token = RefreshToken.for_user(user)
    token = token.access_token
    token.set_exp(lifetime=timedelta(minutes=10))

    current_site = get_current_site(request).domain
    relativeLink = reverse("email-verify")
    verification_url = f"http://{current_site}{relativeLink}?token={str(token)}"

    subject = "Xác thực tài khoản bạn đã đăng ký tại website Sweet Home"

    body = (
        f"Kính gửi {user.username},\n\n"
        f"Cảm ơn bạn đã đăng ký tài khoản tại Sweet Home. Để hoàn tất việc đăng ký, vui lòng xác thực tài khoản của bạn bằng cách nhấn vào liên kết dưới đây:\n\n"
        f"{verification_url}\n\n"
        "Liên kết này có hiệu lực trong vòng 10 phút. Nếu liên kết hết hạn, vui lòng yêu cầu gửi lại email xác thực từ hệ thống.\n\n"
        "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.\n\n"
        "Xin cảm ơn vì đã tin tưởng và sử dụng dịch vụ của Sweet Home.\n\n"
        "Trân trọng,\n"
        "Ban Quản Trị Sweet Home"
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email],
    )

    send_email_async(email)


def decode_token(token):
    try:
        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(token)
        return validated_token.get("user_id")

    except Exception as e:
        logger.error(f"Token decode error: {str(e)}")
        return None


def token_blacklisted(token):
    try:
        refresh_token = RefreshToken(token)
        refresh_token.blacklist()
        return True
    except Exception as e:
        return False


def send_email_account_lock(user, locked_reason, locked_date, unlocked_date):
    subject = "Thông báo: Tài khoản của bạn trên Sweet Home đã bị khóa"

    body = (
        f"Kính gửi {user.username},\n\n"
        f"Chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống Sweet Home đã bị khóa với lý do sau: {locked_reason}\n\n"
        f"Tài khoản của bạn bị khoá trong khoảng thời gian: {locked_date.strftime('%H:%M:%S ngày %d/%m/%Y')} - {unlocked_date.strftime('%H:%M:%S ngày %d/%m/%Y')}.\n\n"
        "Trong thời gian tài khoản bị khóa, bạn sẽ không thể đăng nhập hoặc sử dụng các chức năng của hệ thống. "
        "Nếu bạn cần hỗ trợ hoặc muốn khiếu nại về quyết định này, vui lòng liên hệ với chúng tôi qua email hoặc hotline dưới đây:\n\n"
        "  - Email hỗ trợ: quangpbl1@gmail.com\n"
        "  - Hotline: 0123 456 789\n\n"
        "Chúng tôi chân thành xin lỗi nếu điều này gây bất tiện cho bạn và cảm ơn bạn đã đồng hành cùng Sweet Home.\n\n"
        "Trân trọng,\n"
        "Ban Quản Trị Sweet Home"
    )

    send_email_async(user, subject, body)


def send_email_account_unlock(user, unlocked_date):
    subject = "Thông báo: Tài khoản của bạn trên Sweet Home đã được mở khóa"

    body = (
        f"Kính gửi {user.username},\n\n"
        f"Chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống Sweet Home đã được mở khóa từ {unlocked_date.strftime('%H:%M:%S ngày %d/%m/%Y')}.\n\n"
        "Bạn có thể đăng nhập và sử dụng các chức năng của hệ thống như bình thường. "
        "Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc hotline dưới đây:\n\n"
        "  - Email hỗ trợ: quangpbl1@gmail.com\n"
        "  - Hotline: 0123 456 789\n\n"
        "Cảm ơn bạn đã đồng hành cùng Sweet Home.\n\n"
        "Trân trọng,\n"
        "Ban Quản Trị Sweet Home"
    )

    send_email_async(user, subject, body)
