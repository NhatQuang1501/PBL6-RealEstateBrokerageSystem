# Generated by Django 5.1.2 on 2024-11-16 00:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ChatMessage',
        ),
    ]
