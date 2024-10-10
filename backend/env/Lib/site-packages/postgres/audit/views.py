from postgres.views import AjaxTemplateMixin, FormListView
from postgres.audit.forms import AuditQueryForm


class AuditQuery(AjaxTemplateMixin, FormListView):
    """
    A base class for an audit query view. If you want to use
    the default template names audit/[logs/form].html, then
    you can just use the pre-functionified version below.
    """
    form_class = AuditQueryForm
    context_object_name = 'audit_logs'
    paginate_by = 10

audit = AuditQuery.as_view(
    template_name='audit/logs.html',
    ajax_template_name='audit/form.html'
)
