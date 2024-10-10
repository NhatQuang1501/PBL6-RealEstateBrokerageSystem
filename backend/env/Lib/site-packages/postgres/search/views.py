import json

from django.http import HttpResponse
from django.utils.html import conditional_escape as escape

from ..views import FormListView, AjaxTemplateMixin
from postgres.search.models import Search
from .forms import SearchForm

def uikit(request):
    searches = Search.objects.matching(request.GET['search'], ranked=True)[:15]

    return HttpResponse(json.dumps({
        'results': [
            {
                'title': escape(search.title),
                'url': search.url,
                'text': escape(search.detail),
            } for search in searches
        ]
    }))



class SearchResults(AjaxTemplateMixin, FormListView):
    form_class = SearchForm
    context_object_name = 'search_results'
    paginate_by = 25

results = SearchResults.as_view(template_name='search/page.html', ajax_template_name='search/form.html')