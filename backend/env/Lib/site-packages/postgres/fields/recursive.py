from __future__ import unicode_literals

from django.db import models

SQL = """
WITH RECURSIVE "tree" ("{pk}", "related", "cycle") AS (
    SELECT "{pk}", ARRAY[]::integer[], FALSE
    FROM "{table}" WHERE "{fk}" IS NULL
  UNION ALL
    SELECT a."{pk}", b."related" || a."{fk}", a."{fk}" = ANY(b."related")
    FROM "tree" b, "{table}" a
    WHERE a."{fk}" = b."{pk}" AND NOT b."cycle"
) {query}
"""


class RecursiveRelation(models.ForeignKey):
    def __init__(self, *args, **kwargs):
        # Prevent cycles?
        # Allow literal self-relation?
        super(RecursiveRelation, self).__init__('self', *args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super(RecursiveRelation, self).deconstruct()
        kwargs.pop('to')
        kwargs.pop('to_field', None)
        return name, path, args, kwargs

    def get_lookup_constraint(self, constraint_class, alias, targets, sources, lookups,
                              raw_value):
        if lookups[0] == 'recursive':
            # With a recursive query, we want to build up a subquery that creates
            # the simplest possible tree we can deal with.
            data = {
                'fk': self.get_attname(),
                'pk': self.related_fields[0][1].get_attname(),
                'table': self.model._meta.db_table
            }
            if lookups[-1] == 'in':
                if targets[0] == self:
                    raw_value = ForeignKeyRecursiveInLookup(raw_value, **data)
                else:
                    raw_value = ForeignKeyRecursiveReverseInLookup(raw_value, **data)
            else:
                if targets[0] == self:
                    raw_value = ForeignKeyRecursiveLookup(raw_value, **data)
                else:
                    raw_value = ForeignKeyRecursiveReverseLookup(raw_value, **data)

            # Rewrite some variables so we get correct behaviour.

            # This makes the query based on the original table, not the joined version,
            # which was skipping a level of relation. It still joins the table, however,
            # which can't be great for performance
            alias = self.model._meta.db_table
            # This sets the correct lookup type, removing the "recursive" bit.
            lookups = lookups[1:] or ['exact']

        return super(RecursiveRelation, self).get_lookup_constraint(
            constraint_class, alias, targets, sources, lookups, raw_value
        )


class ForeignKeyRecursiveLookup(object):
    query = 'SELECT "{pk}" FROM "tree" WHERE %s = ANY("related")'

    def __init__(self, value, **kwargs):
        self.value = value
        self.data = kwargs

    def get_compiler(self, *args, **kwargs):
        return self

    def as_subquery_condition(self, alias, columns, qn):
        sql = SQL.format(
            query=self.query.format(**self.data),
            **self.data
        )
        return '%s.%s IN (%s)' % (qn(alias), qn(self.data['pk']), sql), [self.value]


class ForeignKeyRecursiveInLookup(ForeignKeyRecursiveLookup):
    query = 'SELECT "{pk}" FROM "tree" WHERE %s && "related"'


class ForeignKeyRecursiveReverseLookup(ForeignKeyRecursiveLookup):
    query = 'SELECT unnest("related") FROM "tree" WHERE "{pk}" = %s'


class ForeignKeyRecursiveReverseInLookup(ForeignKeyRecursiveLookup):
    query = 'SELECT unnest("related") FROM "tree" WHERE "{pk}" IN %s'
