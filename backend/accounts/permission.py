from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class RoleBasedPermission(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            role = get_role(request)
            return role in self.allowed_roles
        except AuthenticationFailed:
            return False


class IsAdmin(RoleBasedPermission):
    allowed_roles = ["admin"]


class IsUser(RoleBasedPermission):
    allowed_roles = ["user"]


class IsAdminOrUser(RoleBasedPermission):
    allowed_roles = ["admin", "user"]


def get_role(request):
    jwt_auth = JWTAuthentication()
    header = jwt_auth.get_header(request)
    raw_token = jwt_auth.get_raw_token(header)
    validated_token = jwt_auth.get_validated_token(raw_token)
    user_role = validated_token.get("role")
    return user_role
