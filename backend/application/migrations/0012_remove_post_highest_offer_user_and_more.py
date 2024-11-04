# Generated by Django 5.1.2 on 2024-11-04 07:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0011_post_highest_offer_user'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='highest_offer_user',
        ),
        migrations.AddField(
            model_name='negotiation',
            name='highest_offer_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='highest_offer_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
