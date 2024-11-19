from django.contrib import admin

from .models import *


class FriendRequestAdmin(admin.ModelAdmin):
    list_editable = ["friendrequest_status"]
    list_display = ["sender", "receiver", "friendrequest_status", "created_at"]


class FriendShipAdmin(admin.ModelAdmin):
    list_display = ["user1", "user2"]


admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Friendship, FriendShipAdmin)
