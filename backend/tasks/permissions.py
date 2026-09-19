from rest_framework.permissions import BasePermission


class IsProjectOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.isupper

class IsTaskAssign(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assigned_to.filter(id=request.user.id).exists()
    