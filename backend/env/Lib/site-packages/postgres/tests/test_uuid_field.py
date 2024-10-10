from __future__ import unicode_literals

import uuid

from django.core.exceptions import ValidationError
from django.test import TestCase

from postgres.tests.models import UUIDFieldModel, UUIDFieldPKModel


class TestUUIDField(TestCase):
    def test_uuid_field_in_model(self):
        created = UUIDFieldModel.objects.create()
        UUIDFieldModel.objects.get(uuid=created.uuid)

        memory = UUIDFieldModel()
        self.assertTrue(memory.uuid)
        self.assertTrue(isinstance(memory.uuid, uuid.UUID))

    def test_uuid_field_as_pk(self):
        created = UUIDFieldPKModel.objects.create()
        UUIDFieldPKModel.objects.get(pk=created.uuid)

        memory = UUIDFieldPKModel()
        self.assertTrue(memory.pk)
        self.assertTrue(isinstance(memory.uuid, uuid.UUID))

    def test_uuid_field_subfield_base(self):
        obj = UUIDFieldModel()
        obj.uuid = 'b36a53cb610c4ff6ade73f1be0c4b750'
        self.assertTrue(isinstance(obj.uuid, uuid.UUID))
        with self.assertRaises(ValidationError):
            obj.uuid = 'unicode_literals'
