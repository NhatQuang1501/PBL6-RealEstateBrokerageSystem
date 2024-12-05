import os
from celery import Celery

# Cấu hình biến môi trường cho Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery("backend")

# Nạp config từ settings Django
app.config_from_object("django.conf:settings", namespace="CELERY")

# Tự động nạp các task trong ứng dụng Django
app.autodiscover_tasks()
