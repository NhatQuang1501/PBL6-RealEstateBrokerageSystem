from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            role = get_role(request)
            if role == "admin":
                return True
            else:
                return False
        except AuthenticationFailed:
            return super().has_permission(request, view)


class IsUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            user_role = get_role(request)
            if user_role == "user":
                return True
            else:
                return False
        except AuthenticationFailed:
            return super().has_permission(request, view)


class IsAdminOrUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            role = get_role(request)
            if role == "admin" or role == "user":
                return True
            else:
                return False
        except AuthenticationFailed:
            return super().has_permission(request, view)


def get_role(request):
    jwt_auth = JWTAuthentication()
    header = jwt_auth.get_header(request)
    raw_token = jwt_auth.get_raw_token(header)
    validated_token = jwt_auth.get_validated_token(raw_token)
    user_role = validated_token.get("role")
    return user_role
