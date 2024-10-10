import datetime

from django import forms
from psycopg2.extras import DateRange

from postgres.audit.models import AuditLog


class AuditQueryForm(forms.Form):
    start = forms.DateField()
    finish = forms.DateField()

    def get_queryset(self):
        date_range = DateRange(
            lower=self.cleaned_data['start'],
            upper=self.cleaned_data['finish'] + datetime.timedelta(1),
            bounds='[)'
        )

        return AuditLog.objects.filter(timestamp__in=date_range).order_by('-timestamp')