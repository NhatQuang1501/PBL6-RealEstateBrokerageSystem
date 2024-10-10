from django.db.models.fields import IntegerField

class OIDField(IntegerField):
    """
    Postgres OID type.

    Always has an index. Why else would you be using it?
    """
    def __init__(self, *args, **kwargs):
        kwargs['db_index'] = True
        kwargs['editable'] = False
        super(OIDField, self).__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'oid'
