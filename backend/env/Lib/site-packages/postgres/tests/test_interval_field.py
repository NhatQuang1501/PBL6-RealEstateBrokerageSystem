from __future__ import unicode_literals

from datetime import timedelta

from django.test import TestCase

from postgres.forms.interval_field import build_interval
from postgres.tests.models import IntervalFieldModel

class TestIntervalField(TestCase):
    def test_interval_field_in_model(self):
        created = IntervalFieldModel.objects.create(interval=timedelta(1))
        fetched = IntervalFieldModel.objects.get(interval=created.interval)
        self.assertEquals(created.interval, fetched.interval)

    def test_interval_field_parsing(self):
        self.assertEquals(
            timedelta(hours=1, minutes=10, seconds=30),
            build_interval('1:10:30')
        )

