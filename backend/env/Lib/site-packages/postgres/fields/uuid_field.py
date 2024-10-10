from __future__ import unicode_literals

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import six
from django.utils.translation import ugettext_lazy as _

from psycopg2.extras import register_uuid

register_uuid()


class UUIDField(six.with_metaclass(models.SubfieldBase, models.Field)):
    """
    We can make use of psycopg2's uuid handling: that means everything
    at the database end will be a uuid.

    We also make sure that values assigned to this field on a model
    will automatically be cast to UUID.
    """
    description = "UUID"
    default_error_messages = {
        'invalid': _("'%(value)s' is not a valid UUID."),
    }

    def __init__(self, **kwargs):
        kwargs['max_length'] = 36
        super(UUIDField, self).__init__(**kwargs)

    def get_internal_type(self):
        return 'UUIDField'

    def db_type(self, connection):
        return 'uuid'

    def to_python(self, value):
        if not value:
            return None

        if isinstance(value, six.string_types):
            try:
                return uuid.UUID(value)
            except ValueError:
                raise ValidationError(
                    self.error_messages['invalid'],
                    code='invalid',
                    params={'value': value}
                )

        return value
