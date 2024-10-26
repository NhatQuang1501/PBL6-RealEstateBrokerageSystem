from django.contrib import admin
from accounts.models import *


class UserAdmin(admin.ModelAdmin):
    list_editable = ["is_verified"]
    list_display = ["username", "role", "is_verified"]


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "fullname"]


admin.site.register(User, UserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
