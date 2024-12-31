from datetime import datetime, timedelta, timezone
from accounts.enums import Role, Status
from accounts.models import User
from application.models import Post, PostComment, PostReaction
from django.db.models import Count, Q, Sum, F
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear


class ChartHelper:
    def get_total_users(self):
        return User.objects.count()

    def get_new_users(self, period):
        end_date = datetime.now(timezone.utc)
        if period == "day":
            start_date = end_date - timedelta(days=1)
            trunc_func = TruncDay
        elif period == 'week':
            start_date = end_date - timedelta(days=7)
            trunc_func = TruncDay
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
            trunc_func = TruncWeek
        elif period == 'year':
            start_date = end_date - timedelta(days=365)
            trunc_func = TruncMonth
        else:
            start_date = datetime.min.replace(tzinfo=timezone.utc)
            trunc_func = TruncYear

        return (
            User.objects.filter(date_joined__range=(start_date, end_date))
            .annotate(period=trunc_func("date_joined"))
            .values("period")
            .annotate(count=Count("user_id"))
            .order_by("period")
        )

    def get_banned_users(self):
        return User.objects.filter(is_active=False).count()

    def get_total_posts(self):
        return Post.objects.count()

    def get_new_posts(self, period):
        end_date = datetime.now(timezone.utc)
        if period == "day":
            start_date = end_date - timedelta(days=1)
            trunc_func = TruncDay
        elif period == 'week':
            start_date = end_date - timedelta(days=7)
            trunc_func = TruncDay
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
            trunc_func = TruncWeek
        elif period == 'year':
            start_date = end_date - timedelta(days=365)
            trunc_func = TruncMonth
        else:
            start_date = datetime.min.replace(tzinfo=timezone.utc)
            trunc_func = TruncYear

        return (
            Post.objects.filter(created_at__range=(start_date, end_date))
            .annotate(period=trunc_func("created_at"))
            .values("period")
            .annotate(count=Count("post_id"))
            .order_by("period")
        )

    def get_violated_posts(self):
        return Post.objects.filter(status=Status.REJECTED).count()

    def get_interactions_summary(self):
        total_reacts = PostReaction.objects.count()
        total_comments = PostComment.objects.count()
        total_views = Post.objects.aggregate(total_views=Sum("view_count"))[
            "total_views"
        ]
        return {
            "total_reacts": total_reacts,
            "total_comments": total_comments,
            "total_views": total_views,
        }

    def get_most_interacted_post(self):
        return (
            Post.objects.annotate(
                total_interactions=Count("postreaction")
                + Count("postcomment")
                + F("view_count")
            )
            .order_by("-total_interactions")
            .first()
        )
