from rest_framework.permissions import BasePermission


class IsUser(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra người dùng có vai trò "user" hay không
        return request.user.user_role.filter(role__name='user').exists()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra người dùng có vai trò "admin" hay không
        return request.user.user_role.filter(role__name='admin').exists()


class IsUserOrAdmin(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra người dùng có vai trò "user" hoặc "admin"
        return request.user.user_role.filter(role__name__in=['user', 'admin']).exists()
