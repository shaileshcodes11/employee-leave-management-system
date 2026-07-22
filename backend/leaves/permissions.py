from rest_framework import permissions

from accounts.models import User


class IsEmployee(permissions.BasePermission):
    """Allows access only to users with the Employee role."""

    message = 'Only employees can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.EMPLOYEE
        )


class IsManager(permissions.BasePermission):
    """Allows access only to users with the Manager role."""

    message = 'Only managers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.MANAGER
        )


class IsOwner(permissions.BasePermission):
    """Object-level permission: the leave must belong to the requesting employee."""

    message = 'You do not have permission to access this leave request.'

    def has_object_permission(self, request, view, obj):
        return obj.employee_id == request.user.id
