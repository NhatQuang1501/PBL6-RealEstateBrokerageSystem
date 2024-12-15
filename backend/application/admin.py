from django.contrib import admin
from application.models import *


class PostAdmin(admin.ModelAdmin):
    list_editable = ["status"]
    list_display = ["title", "city", "price", "status", "created_at"]


class NegotiationAdmin(admin.ModelAdmin):
    list_editable = ["is_considered", "is_accepted"]
    list_display = [
        "post",
        "user",
        "negotiation_price",
        "negotiation_date",
        "is_considered",
        "is_accepted",
    ]


class ProposalAdmin(admin.ModelAdmin):
    list_editable = ["is_accepted"]
    list_display = [
        "negotiation",
        "user",
        "proposal_price",
        "proposal_date",
        "is_accepted",
    ]


class SavedPostAdmin(admin.ModelAdmin):
    list_display = ["post", "user"]


class ReportAdmin(admin.ModelAdmin):
    list_display = [
        "reportee",
        "reported_user",
        "report_type",
        "description",
        "resolved",
    ]
    list_editable = ["resolved"]


admin.site.register(Post, PostAdmin)
admin.site.register(Negotiation, NegotiationAdmin)
admin.site.register(Proposal, ProposalAdmin)
admin.site.register(PostComment)
admin.site.register(PostReaction)
admin.site.register(PostImage)
admin.site.register(SavedPost, SavedPostAdmin)
admin.site.register(Report, ReportAdmin)
