from django.db import models
from django.core.urlresolvers import reverse

import postgres.fields


class SearchQuerySet(models.QuerySet):
    def matching(self, search_term, ranked=False):
        search_term = '%s:*' % search_term.lower()
        matches = self.extra(
            where=['term @@ to_tsquery(%s)'],
            params=[search_term]
        )
        if ranked:
            matches = matches.extra(select={
                'rank': 'ts_rank(term, to_tsquery(%s))'
            }, select_params=(search_term,)).order_by('-rank')
        return matches


class Search(models.Model):
    title = models.TextField()
    detail = models.TextField()
    url_name = models.TextField()
    url_kwargs = postgres.fields.JSONField()

    objects = SearchQuerySet.as_manager()

    class Meta:
        managed = False

    @property
    def url(self):
        return reverse(self.url_name, kwargs=self.url_kwargs)
