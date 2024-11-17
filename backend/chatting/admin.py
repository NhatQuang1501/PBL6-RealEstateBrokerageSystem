from django.contrib import admin

from .models import ChatRoom, Message


class MessageAdmin(admin.ModelAdmin):
    list_display = ["chatroom", "sender", "content", "created_at"]


# Register your models here.
admin.site.register(ChatRoom)
admin.site.register(Message, MessageAdmin)
