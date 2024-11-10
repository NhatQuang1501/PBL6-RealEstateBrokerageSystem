from django.contrib import admin
from application.models import *


class PostAdmin(admin.ModelAdmin):
    list_editable = ["status"]
    list_display = ["title", "city", "price", "status", "created_at"]


class NegotiationAdmin(admin.ModelAdmin):
    list_editable = ["is_accepted"]
    list_display = ["post", "user", "offer_price", "is_accepted"]


class SavedPostAdmin(admin.ModelAdmin):
    list_display = ["post", "user"]


admin.site.register(Post, PostAdmin)
admin.site.register(Negotiation, NegotiationAdmin)
admin.site.register(PostComment)
admin.site.register(PostReaction)
admin.site.register(PostImage)
admin.site.register(SavedPost, SavedPostAdmin)
