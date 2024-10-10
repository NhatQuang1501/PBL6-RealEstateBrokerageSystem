from django.db.models import fields
from django.db import connection
from django.dispatch import receiver, Signal

from psycopg2.extras import register_composite
from psycopg2.extensions import register_adapter, adapt, AsIs
from psycopg2 import ProgrammingError


_missing_types = {}


class CompositeMeta(type):
    def __init__(cls, name, bases, clsdict):
        super(CompositeMeta, cls).__init__(name, bases, clsdict)
        cls.register_composite()

    def register_composite(cls):
        db_type = cls().db_type(connection)
        if db_type:
            try:
                cls.python_type = register_composite(
                    db_type,
                    connection.cursor().cursor,
                    globally=True
                ).type
            except ProgrammingError:
                _missing_types[db_type] = cls
            else:
                def adapt_composite(composite):
                    return AsIs("(%s)::%s" % (
                        ", ".join([
                            adapt(getattr(composite, field)).getquoted() for field in composite._fields
                        ]), db_type
                    ))

                register_adapter(cls.python_type, adapt_composite)


class CompositeField(fields.Field):
    # We should also incorporate the stuff from SubFieldBase, so
    # we convert any iterable of the correct arity, and coercable types
    # into the python_type.
    __metaclass__ = CompositeMeta
    """
    A handy base class for defining your own composite fields.

    It registers the composite type.
    """


composite_type_created = Signal(providing_args=['name'])

@receiver(composite_type_created)
def register_composite_late(sender, db_type, **kwargs):
    _missing_types.pop(db_type).register_composite()
