from django.contrib import admin
from .models import Notification


# Register your models here.
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "description", "created_at", "is_read"]
    list_editable = ["is_read"]


admin.site.register(Notification, NotificationAdmin)
