from celery import shared_task
from django.utils import timezone
from accounts.models import User
from accounts.utils import send_email_account_unlock


@shared_task
def unlock_user_account():
    users = User.objects.filter(is_locked=True, unlocked_date__lt=timezone.now())

    for user in users:
        user.is_locked = False
        user.locked_date = None
        user.unlocked_date = None
        user.locked_reason = None
        user.save()
        send_email_account_unlock(user, timezone.now())
