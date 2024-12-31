import django
from django.conf import settings

if not settings.configured:
    settings.configure()

django.setup()
