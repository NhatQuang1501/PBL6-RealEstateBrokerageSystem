from rest_framework.permissions import BasePermission


class HasRole(BasePermission):
    def has_permission(self, request, view):
        required_role = getattr(view, 'required_role', None)
        if required_role:
            return request.user.user_role.filter(role__name=required_role)
        return False
