from django.contrib import admin

from .models import ChatRoom, Message


class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ["chatroom_id", "chatroom_name", "created_by", "is_private"]


class MessageAdmin(admin.ModelAdmin):
    list_display = ["chatroom", "sender", "content", "created_at"]


# Register your models here.
admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message, MessageAdmin)
