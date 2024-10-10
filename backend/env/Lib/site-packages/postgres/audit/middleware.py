from django.db import connection

SET_USER = 'SET "app.user" TO %s; SET "app.ip_address" TO %s; SET "app.session" TO %s'


class AuditAppUserMiddleware(object):
    def process_view(self, request, *args, **kwargs):
        cursor = connection.cursor()
        if request.user.pk and request.META.get('REMOTE_ADDR'):
            cursor.execute(SET_USER, [
                request.user.pk,
                request.META['REMOTE_ADDR'],
                request.session.session_key,
            ])
