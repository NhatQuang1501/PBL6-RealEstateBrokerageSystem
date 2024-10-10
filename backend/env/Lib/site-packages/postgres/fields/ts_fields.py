from django.db import models

from postgres.lookups import PostgresLookup


class TSVectorField(models.Field):

    def db_type(self, connection):
        return 'tsvector'


class TSQueryField(models.Field):
    def db_type(self, connection):
        return 'tsquery'


class TSVectorMatches(PostgresLookup):
    lookup_name = 'matches'
    operator = '@@'

TSVectorField.register_lookup(TSVectorMatches)
