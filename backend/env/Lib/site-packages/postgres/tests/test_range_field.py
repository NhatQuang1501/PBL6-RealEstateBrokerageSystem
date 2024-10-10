from __future__ import unicode_literals

import datetime

from django.test import TestCase
from psycopg2.extras import DateRange, DateTimeTZRange, NumericRange

from postgres.tests.models import RangeFieldsModel, DjangoFieldsModel


class TestRangeFields(TestCase):
    def test_range_fields_in_model(self):
        RangeFieldsModel.objects.create()
        RangeFieldsModel.objects.get()

    def test_datetime_range(self):
        RangeFieldsModel.objects.create(
            datetime_range='[2014-01-01 09:00:00, 2014-01-01 12:30:00)'
        )
        RangeFieldsModel.objects.create(
            datetime_range=DateTimeTZRange(
                datetime.datetime(2014, 1, 1, 9, 0),
                datetime.datetime(2014, 1, 1, 12, 30)
            )
        )


class TestRangeFieldLookups(TestCase):
    def test_range_equal(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range='[1,7]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range='[1,8)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range='(0,7]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range='(0,8)').count())

    def test_less_than(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__lt='[1,8]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__lt='[1,7]').count())

    def test_greater_than(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__gt='[0,8]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__gt='[1,7]').count())

    def test_range_overlaps(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='[7,8]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='[0,2]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='[2,2]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='[0,108]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='(,)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__overlaps='(6,10]').count())

        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__overlaps='(,1)').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__overlaps='(7,)').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__overlaps='[2,2)').count())

    def test_range_contains(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains='[2,2]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains='[1,7]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains='(0,8)').count())

        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='[7,8]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='[0,2]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='[0,108]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='(,)').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='(6,10]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='(,1)').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains='(7,)').count())

        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains=0).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=1).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=2).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=3).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=4).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=5).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=6).count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__contains=7).count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__contains=8).count())

    def test_range_in(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        # self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__in='(,)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__in='(0,8)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__in='[1,8)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__in='[1,7]').count())

        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__in='(,7)').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__in='(1,)').count())

    def test_left_of(self):
        RangeFieldsModel.objects.create(int4_range='[1,7]')

        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__left_of='[1,7]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__left_of='[1,1]').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__left_of='[8,9]').count())
        self.assertEquals(0, RangeFieldsModel.objects.filter(int4_range__left_of='[7,)').count())
        self.assertEquals(1, RangeFieldsModel.objects.filter(int4_range__left_of='(8,)').count())


class TestDjangoFieldLookupsWithRange(TestCase):
    def test_int4_range_lookups(self):
        _0 = DjangoFieldsModel.objects.create(integer=0)
        _10 = DjangoFieldsModel.objects.create(integer=10)
        _20 = DjangoFieldsModel.objects.create(integer=20)
        _100 = DjangoFieldsModel.objects.create(integer=100)

        result = DjangoFieldsModel.objects.filter(integer__inrange=NumericRange(lower=1, upper=20, bounds='[]'))
        self.assertEquals(set([_10, _20]), set(result))

        result = DjangoFieldsModel.objects.filter(integer__inrange='[1,20]')
        self.assertEquals(set([_10, _20]), set(result))

        result = DjangoFieldsModel.objects.filter(integer__inrange='(10,100)')
        self.assertEquals(set([_20]), set(result))

        result = DjangoFieldsModel.objects.filter(integer__inrange='(,)')
        self.assertEquals(set([_0, _10, _20, _100]), set(result))

        result = DjangoFieldsModel.objects.exclude(integer__inrange='[1,20]')
        self.assertEquals(set([_0, _100]), set(result))

    def test_date_range_lookups(self):
        a = DjangoFieldsModel.objects.create(date='2001-01-01')
        b = DjangoFieldsModel.objects.create(date='2001-01-02')
        c = DjangoFieldsModel.objects.create(date='2001-01-03')
        d = DjangoFieldsModel.objects.create(date='2001-01-04')

        result = DjangoFieldsModel.objects.filter(date__inrange=DateRange(lower='2001-01-01', upper='2001-01-03', bounds='(]'))
        self.assertEquals(set([b, c]), set(result))

        result = DjangoFieldsModel.objects.filter(date__inrange='(2001-01-01,2001-01-03]')
        self.assertEquals(set([b, c]), set(result))
