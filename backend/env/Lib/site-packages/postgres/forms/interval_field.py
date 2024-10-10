import datetime
import re

from django import forms

INTERVAL_RE = re.compile(
    r'^((?P<days>\d+) days)?,?\W*'
    r'((?P<hours>\d\d?)(:(?P<minutes>\d\d)(:(?P<seconds>\d\d))?)?)?$'
)
FLEXIBLE_RE = re.compile(
    r'^((?P<weeks>-?((\d*\.\d+)|\d+))\W*w((ee)?(k(s)?)?)(,)?\W*)?'
    r'((?P<days>-?((\d*\.\d+)|\d+))\W*d(ay(s)?)?(,)?\W*)?'
    r'((?P<hours>-?((\d*\.\d+)|\d+))\W*h(ou)?(r(s)?)?(,)?\W*)?'
    r'((?P<minutes>-?((\d*\.\d+)|\d+))\W*m(in(ute)?(s)?)?(,)?\W*)?'
    r'((?P<seconds>-?((\d*\.\d+)|\d+))\W*s(ec(ond)?(s)?)?)?\W*$',
)


def timedelta(data):
    return datetime.timedelta(**{
        key: float(value) for key, value in data if value is not None
    })


def build_interval(data):
    for matcher in [INTERVAL_RE, FLEXIBLE_RE]:
        match = matcher.match(data)
        if match:
            return timedelta(match.groupdict().items())


class IntervalField(forms.CharField):
    def clean(self, value):
        if value:
            interval = build_interval(value)
            if interval is None:
                raise forms.ValidationError('Does not match interval format.')
            return interval

    def _coerce(self, data):
        return build_interval(data)
