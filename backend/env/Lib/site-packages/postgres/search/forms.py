from django import forms

from postgres.search.models import Search


class SearchForm(forms.Form):
    q = forms.CharField()

    def get_queryset(self):
        return Search.objects.matching(self.cleaned_data['q'])
