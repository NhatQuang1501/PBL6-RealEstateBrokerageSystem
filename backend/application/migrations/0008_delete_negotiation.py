# Generated by Django 5.1.2 on 2024-10-29 08:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0007_remove_post_highest_offer_price'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Negotiation',
        ),
    ]
