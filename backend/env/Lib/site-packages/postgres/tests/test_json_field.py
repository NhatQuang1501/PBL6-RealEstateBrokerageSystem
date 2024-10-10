from __future__ import unicode_literals
from decimal import Decimal
import datetime

from django.test import TestCase

from postgres.tests.models import JSONFieldModel, JSONFieldNullModel


class TestJSONField(TestCase):
    def test_json_field_in_model(self):
        created = JSONFieldModel.objects.create(json={'foo': 'bar'})
        fetched = JSONFieldModel.objects.get()
        self.assertEquals({'foo': 'bar'}, fetched.json)

    def test_numeric_as_decimal(self):
        JSONFieldModel.objects.create(json=[1,2,"three",4.0])
        obj = JSONFieldModel.objects.get()
        self.assertEquals([1,2,'three',Decimal('4.0')], obj.json)

    def test_date_data(self):
        JSONFieldModel.objects.create(json=[
            datetime.date(2001,1,1),
            datetime.datetime(2002,2,2,2,2,2),
            datetime.time(3,4,5),
        ])
        obj = JSONFieldModel.objects.get()
        self.assertEquals([
            '2001-01-01', '2002-02-02T02:02:02', '03:04:05'
        ], obj.json)


class TestJSONFieldLookups(TestCase):
    def test_exact(self):
        JSONFieldModel.objects.create(json={})
        JSONFieldModel.objects.create(json={'foo': 'bar'})
        JSONFieldModel.objects.create(json=[])
        JSONFieldModel.objects.create(json=["foo","bar"])
        JSONFieldModel.objects.create(json='"foo"')
        self.assertEquals(5, JSONFieldModel.objects.all().count())
        self.assertEquals(4, JSONFieldModel.objects.exclude(json={}).count())
        self.assertEquals(1, JSONFieldModel.objects.filter(json={}).count())
        self.assertEquals(1, JSONFieldModel.objects.filter(json={'foo':'bar'}).count())

    def test_contains(self):
        JSONFieldModel.objects.create(json={})
        JSONFieldModel.objects.create(json={'foo':'bar'})
        JSONFieldModel.objects.create(json=[])
        JSONFieldModel.objects.create(json=["foo","bar"])
        JSONFieldModel.objects.create(json='"foo"')
        self.assertEquals(1, JSONFieldModel.objects.filter(json__contains={'foo':'bar'}).count())
        JSONFieldModel.objects.create(json={'foo':'bar', 'baz':'bing'})
        self.assertEquals(2, JSONFieldModel.objects.filter(json__contains={'foo':'bar'}).count())
        self.assertEquals(1, JSONFieldModel.objects.filter(json__contains={'baz':'bing', 'foo':'bar'}).count())
        self.assertEquals(2, JSONFieldModel.objects.filter(json__contains=[]).count())
        self.assertEquals(1, JSONFieldModel.objects.filter(json__contains=['foo']).count())

    def test_isnull(self):
        JSONFieldNullModel.objects.create(json=None)
        JSONFieldNullModel.objects.create(json={})
        JSONFieldNullModel.objects.create(json={'foo':'bar'})
        JSONFieldNullModel.objects.create(json=["foo","bar"])
        JSONFieldNullModel.objects.create(json='"foo"')
        JSONFieldNullModel.objects.create(json=[])

        self.assertEquals(1, JSONFieldNullModel.objects.filter(json=None).count())
        self.assertEquals(None, JSONFieldNullModel.objects.get(json=None).json)

    def test_has(self):
        a = JSONFieldModel.objects.create(json={'a': 1})
        b = JSONFieldModel.objects.create(json={'b': 1})
        c = JSONFieldModel.objects.create(json=[])
        d = JSONFieldModel.objects.create(json=['a'])
        e = JSONFieldModel.objects.create(json=['b'])
        f = JSONFieldModel.objects.create(json=['x', 'a'])
        results = JSONFieldModel.objects.filter(json__has='a')
        self.assertEquals(set([a, d, f]), set(results))

    def test_in(self):
        a = JSONFieldModel.objects.create(json={'a': 1})
        b = JSONFieldModel.objects.create(json={'b': 1})
        c = JSONFieldModel.objects.create(json=['a', 'b'])
        d = JSONFieldModel.objects.create(json=['a', 'b', 'c'])

        results = JSONFieldModel.objects.filter(json__in={'a': 1, 'b': 1})
        self.assertEquals(set([a, b]), set(results))

        results = JSONFieldModel.objects.filter(json__in={'a': 1, 'b': 2})
        self.assertEquals(set([a]), set(results))

        results = JSONFieldModel.objects.filter(json__in=['a', 'b'])
        self.assertEquals(set([c]), set(results))

        results = JSONFieldModel.objects.filter(json__in=['a', 'b', 'c'])
        self.assertEquals(set([c,d]), set(results))

    def test_has_any(self):
        a = JSONFieldModel.objects.create(json={'a': 1})
        b = JSONFieldModel.objects.create(json={'b': 1})
        c = JSONFieldModel.objects.create(json=['a', 'b'])
        d = JSONFieldModel.objects.create(json=['a', 'b', 'c'])

        results = JSONFieldModel.objects.filter(json__has_any=['a', 'c'])
        self.assertEquals(set([a, c, d]), set(results))

    def test_has_all(self):
        a = JSONFieldModel.objects.create(json={'a': 1})
        b = JSONFieldModel.objects.create(json={'b': 1})
        c = JSONFieldModel.objects.create(json=['a', 'b'])
        d = JSONFieldModel.objects.create(json=['a', 'b', 'c'])

        results = JSONFieldModel.objects.filter(json__has_all=['a', 'b'])
        self.assertEquals(set([c, d]), set(results))


    def test_element_is(self):
        a = JSONFieldModel.objects.create(json=[{"a":"foo"},{"b":"bar"},{"c":"baz"}])
        b = JSONFieldModel.objects.create(json=[{"a":1},{"b":2},{"c":3}])
        c = JSONFieldModel.objects.create(json=[0,2,4])
        d = JSONFieldModel.objects.create(json={'a': 1, 'b': {'c': [2, 4, 5]}})
        e = JSONFieldModel.objects.create(json='"a"')

        results = JSONFieldModel.objects.filter(json__1={'b': 'bar'})
        self.assertEquals(set([a]), set(results))

        results = JSONFieldModel.objects.filter(json__0__lt=2)
        self.assertEquals(set([c]), set(results))

        results = JSONFieldModel.objects.filter(json__a=1)
        self.assertEquals(set([d]), set(results))

        # You can chain element lookups, but really you should use a
        # path lookup.
        results = JSONFieldModel.objects.filter(json__0__a__b__c__gte=2)
        self.assertEquals(0, results.count())

        results = JSONFieldModel.objects.filter(json__0__a__gte=1)
        self.assertEquals(set([b]), set(results))

    def test_path(self):
        a = JSONFieldModel.objects.create(json=[{"a":"foo"},{"b":"bar"},{"c":"baz"}])
        b = JSONFieldModel.objects.create(json=[{"a":1},{"b":2},{"c":3}])
        c = JSONFieldModel.objects.create(json=[0,2,4])
        d = JSONFieldModel.objects.create(json={'a': 1, 'b': {'c': [2, 4, 5]}})
        e = JSONFieldModel.objects.create(json='"a"')
        f = JSONFieldModel.objects.create(json='["a",1]')

        results = JSONFieldModel.objects.filter(json__path_0_a_b_c__gte=2)
        self.assertEquals(0, results.count())

        results = JSONFieldModel.objects.filter(json__path_0_a__gte=1)
        self.assertEquals(set([b]), set(results))

        self.assertIn(
            '''"tests_jsonfieldmodel"."json" #> '{0,a}' >= 1''',
            results.query.__str__(),
            "Query appears to not use a path lookup."
        )