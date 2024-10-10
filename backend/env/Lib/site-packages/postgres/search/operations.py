import re

from django.db import connection
from django.db.migrations.operations.base import Operation

CREATE_VIEW = "CREATE OR REPLACE VIEW search_search AS\n%s"

QUERY = """SELECT
    ''::text AS id,
    %(search_columns)s AS term,
    %(title)s::text AS title,
    %(detail)s AS detail,
    %(url_name)s AS url_name,
    json_build_object(%(url_kwargs)s)::jsonb AS url_kwargs
FROM
    %(table)s
"""

QUERY_RE = re.compile(r'^\W+SELECT (?P<columns>.*) FROM (?P<table>[^\n\t ]*)', re.DOTALL)


def inspect_query(query):
    return QUERY_RE.match(query).groupdict()


def get_current_view_definition():
    cursor = connection.cursor()
    cursor.execute("SELECT schemaname, definition FROM pg_views WHERE viewname='search_search' LIMIT 1")
    view = cursor.fetchone()
    if view:
        # Replace all of the schemaname.tablename bits by just tablename.
        return view[1].replace('FROM %s.' % view[0], 'FROM ').rstrip(';').split('UNION ALL')
    return []


def updated_view_definition(data):
    queries = get_current_view_definition()
    found = False
    for i, query in enumerate(queries):
        if inspect_query(query)['table'] == data['table']:
            queries[i] = QUERY % data
            found = True
            break

    if not found:
        queries.append(QUERY % data)

    return CREATE_VIEW % ('\nUNION ALL\n'.join(queries))


def removed_view_definition(data):
    queries = [
        query for query in get_current_view_definition()
        if inspect_query(query)['table'] != data['table']
    ]
    if not queries:
        return 'DROP VIEW IF EXISTS search_search'

    return CREATE_VIEW % '\nUNION ALL\n'.join(queries)


def quote_text(value, table):
    if isinstance(value, (list, tuple)):
        return " || ' ' || ".join([quote_text(_value, table) for _value in value])

    if value[0] == "'":
        return "%s::text" % value

    return "%s.%s::text" % (table, value)


class SearchModel(Operation):
    def __init__(self,
        table,
        search_columns,
        title,
        detail,
        url_name,
        url_kwargs=None
    ):
        url_kwargs = url_kwargs or {'pk': 'id'}
        self.data = {
            'table': table,
            'search_columns': " || ".join([
                'to_tsvector(%s.%s::text)' % (table, column)
                for column in search_columns
            ]),
            'title': quote_text(title, table),
            'detail': quote_text(detail, table),
            'url_name': "'%s'::text" % url_name,    # Always a quoted string?
            'url_kwargs': ', '.join([
                "'%s', %s.%s" % (name, table, field)
                for name, field in url_kwargs.items()
            ])
        }

    @property
    def reversible(self):
        return True

    def state_forwards(self, app_label, state):
        pass

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        sql = updated_view_definition(self.data)
        schema_editor.execute(sql)

    def state_backwards(self, app_label, state):
        pass

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        # We want to remove our table from the view definition.
        sql = removed_view_definition(self.data)
        schema_editor.execute(sql)
