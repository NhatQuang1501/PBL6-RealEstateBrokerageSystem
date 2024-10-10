
from django import forms
from django.utils.translation import ugettext_lazy as _

from psycopg2.extras import Range, NumericRange, DateRange, DateTimeTZRange

LOWER = [('(', '('), ('[', '[')]
UPPER = [(')', ')'), (']', ']')]


class RangeWidget(forms.MultiWidget):
    base_widget = None

    def __init__(self):
        return super(RangeWidget, self).__init__(widgets=[
            forms.Select(choices=LOWER),
            self.base_widget,
            self.base_widget,
            forms.Select(choices=UPPER)
        ])

    def decompress(self, value):
        if not value:
            return [None, None, None, None]
        return [
            value._bounds[0],
            value.lower,
            value.upper,
            value._bounds[1]
        ]


class DateRangeWidget(RangeWidget):
    base_widget = forms.DateInput

class DateTimeRangeWidget(RangeWidget):
    base_widget = forms.DateTimeInput

class NumericRangeWidget(RangeWidget):
    base_widget = forms.TextInput


class RangeField(forms.MultiValueField):
    widget = None
    base_field = None
    range_type = None

    def __init__(self, *args, **kwargs):
        self.range_type = kwargs.pop('range_type', self.range_type or Range)
        self.base_field = kwargs.pop('base_field', self.base_field or forms.IntegerField)
        self.widget = kwargs.pop('widget', self.widget)

        fields = (
            forms.ChoiceField(choices=LOWER),
            self.base_field(),
            self.base_field(),
            forms.ChoiceField(choices=UPPER)
        )

        return super(RangeField, self).__init__(
            fields=fields, *args, **kwargs
        )

    def clean(self, value):
        return self.compress([
            self.fields[i].clean(v) for i, v in enumerate(value)
        ])

    def compress(self, data_list):
        if data_list[2] < data_list[1]:
            raise forms.ValidationError(_('Range lower bound must be less than or equal to range upper bound.'))
        return self.range_type(
            lower=data_list[1],
            upper=data_list[2],
            bounds='%s%s' % (data_list[0], data_list[3])
        )


class DateRangeField(RangeField):
    widget = DateRangeWidget
    base_field = forms.DateField
    range_type = DateRange


class DateTimeRangeField(DateRangeField):
    widget = DateTimeRangeWidget
    range_type = DateTimeTZRange
    base_field = forms.DateTimeField


class NumericRangeField(RangeField):
    widget = NumericRangeWidget
    base_field = forms.IntegerField
    range_type = NumericRange
