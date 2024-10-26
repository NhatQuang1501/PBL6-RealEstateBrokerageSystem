from django.contrib import admin
from application.models import *


class PostAdmin(admin.ModelAdmin):
    list_editable = ["status"]
    list_display = ["title", "city", "price", "status", "created_at"]


admin.site.register(Post, PostAdmin)
