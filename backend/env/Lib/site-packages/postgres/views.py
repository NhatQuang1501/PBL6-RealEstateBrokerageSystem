from django.views.generic.edit import FormMixin
from django.views.generic import ListView

class AjaxTemplateMixin(object):
    ajax_template_name = None

    def get_template_names(self):
        if self.ajax_template_name and self.request.is_ajax():
            return [self.ajax_template_name]
        return super(AjaxTemplateMixin, self).get_template_names()


class FilteredListView(FormMixin, AjaxTemplateMixin, ListView):
    results_title = None
    submit_empty = True

    def get_form_kwargs(self):
        return {
            'initial': self.get_initial(),
            'prefix': self.get_prefix(),
            'data': self.request.GET or None,
        }

    def get(self, request, *args, **kwargs):
        form = self.get_form(self.get_form_class())

        self.object_list = self.get_queryset()

        if form.is_valid():
            self.object_list = self.object_list.filter(**form.filter_by())

        context = self.get_context_data(form=form)
        return self.render_to_response(context)


class FormListView(FormMixin, ListView):
    """
    The query parameters come from the form.

    Only if the form is valid will the queryset be fetched.
    """
    submit_empty = False

    def get_form_kwargs(self):
        return {
            'initial': self.get_initial(),
            'prefix': self.get_prefix(),
            'data': self.request.GET or None,
        }

    def get(self, request, *args, **kwargs):
        form = self.get_form(self.get_form_class())
        if form.is_valid():
            self.object_list = form.get_queryset()
        else:
            self.object_list = []
        context = self.get_context_data(form=form)
        return self.render_to_response(context)


