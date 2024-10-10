import datetime

from django.core import exceptions
from django.db import models

from postgres.forms.interval_field import IntervalField as IntervalFormField
from postgres.forms.interval_field import build_interval


class IntervalField(models.Field):
    description = 'Interval Field'

    def db_type(self, connection):
        return 'interval'

    def get_internal_type(self):
        return 'IntervalField'

    def to_python(self, value):
        if value is None:
            return value

        if isinstance(value, datetime.timedelta):
            return value

        try:
            interval = build_interval(value)
        except ValueError:
            pass
        else:
            if interval is not None:
                return interval

        raise exceptions.ValueError(
            self.error_messages['invalid'],
            code='invalid',
            params={'value': value}
        )

    def get_prep_value(self, value):
        if value == '' and self.null:
            return None
        return value

    def formfield(self, **kwargs):
        defaults = {'form_class': IntervalFormField}
        defaults.update(kwargs)
        return super(IntervalField, self).formfield(**defaults)
