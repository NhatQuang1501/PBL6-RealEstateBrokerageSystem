from django.conf import settings
from django.db import models
from django.utils.functional import cached_property

import postgres.fields.json_field
import postgres.fields.internal_types
import postgres.fields.bigint_field


known_models = {}


def get_model_from_table(table):
    if not known_models:
        for model in models.get_models():
            known_models[model._meta.db_table] = model

    return known_models[table]


def get_field_display(instance, field):
    # If we were just usable in a template, we could get rid
    # of the lambda and the call.
    return getattr(
        instance,
        'get_%s_display' % field,
        lambda: getattr(instance, field)
    )()


class AuditLogQuerySet(models.QuerySet):
    def for_instance(self, instance):
        pk = {
            'row_data__%s' % instance._meta.pk.name: instance.pk
        }
        return self.filter(
            table_name=instance._meta.db_table,
            **pk
        )

    def inserts(self):
        return self.filter(action='I')

    def updates(self):
        return self.filter(action='U')

    def deletes(self):
        return self.filter(action='D')

    def after(self, when):
        return self.filter(timestamp__gt=when)

    def before(self, when):
        return self.filter(timestamp__lt=when)

    def between(self, start, finish):
        return self.before(finish).after(start)

    def by_user(self, user):
        return self.filter(app_user=user.pk)


class AuditManager(models.Manager):
    def get_queryset(self):
        return super(AuditManager, self).get_queryset().select_related('app_user')


class AuditLog(models.Model):
    """
    This is really only for being able to access the data,
    we shouldn't use it for saving. Perhaps we could have the
    underlying system create a read-only view so any saves fail.
    """

    action = models.TextField(choices=[
        ('I', 'INSERT'),
        ('U', 'UPDATE'),
        ('D', 'DELETE'),
        ('T', 'TRUNCATE'),
    ], db_index=True)
    table_name = models.TextField()
    relid = postgres.fields.internal_types.OIDField()
    timestamp = models.DateTimeField()
    transaction_id = models.BigIntegerField(null=True)
    client_query = models.TextField()
    statement_only = models.BooleanField(default=False)
    row_data = postgres.fields.json_field.JSONField(null=True)
    changed_fields = postgres.fields.json_field.JSONField(null=True)
    app_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    app_ip_address = models.IPAddressField(null=True)
    app_session = models.TextField(null=True)

    objects = AuditManager.from_queryset(AuditLogQuerySet)()

    @property
    def current_instance(self):
        model = get_model_from_table(self.table_name)
        # Need to get primary key field name from model class.
        pk = model._meta.pk
        return model._default_manager.get(**{pk.name: self.row_data[pk.name]})

    @cached_property
    def model_class(self):
        return get_model_from_table(self.table_name)

    @cached_property
    def model_name(self):
        return self.model_class._meta.verbose_name

    def _build_model(self, data):
        """
        Given a dict of data, convert it into a dict with
        the correct field names, and related objects.
        """
        model = self.model_class
        # Make a copy, as we may mutate it.
        data = dict(data)

        # Remap db_column to django field name.
        fields = []
        for field in model._meta.fields:
            fields.append(field.name)
            if field.rel:
                db_column = field.db_column or (field.name + '_id')
                # What if this instance doesn't exist?
                data[field.name] = field.rel.to.objects.get(pk=data.pop(db_column))
            elif field.db_column:
                data[field.name] = data.pop(field.db_column)

        data = dict((key, value) for (key, value) in data.items() if key in fields)

        return model(**data)

    @cached_property
    def field_name_mapping(self):
        fields = {}
        model = self.model_class
        for field in model._meta.fields:
            fields[field.db_column or field.name] = field.name
        return fields

    @cached_property
    def field_title_mapping(self):
        fields = {}
        model = self.model_class
        for field in model._meta.fields:
            if field.primary_key or not field.editable:
                continue
            fields[field.db_column or field.name] = field.verbose_name
        return fields

    @cached_property
    def changed_data(self):
        field_names = self.field_name_mapping
        field_titles = self.field_title_mapping
        new_instance = self.new_instance

        if self.action == 'I':
            # New object! all fields are new.
            return [{
                'field': field_titles[key],
                'new': get_field_display(new_instance, field_names[key]),
            } for key in self.row_data if key in field_titles]

        old_instance = self.old_instance

        return [
            {
                'field': field_titles[key],
                'old': get_field_display(old_instance, field_names[key]),
                'new': get_field_display(new_instance, field_names[key]),
            } for key in self.changed_fields
            if key in field_titles
        ]

    @cached_property
    def old_instance(self):
        """
        What the instance looked like before the change.

        For an INSERT, it will be None: for UPDATE/DELETE, it
        will be the data that was stored.
        """
        if self.action == 'I':
            return None
        return self._build_model(self.row_data)

    @property
    def new_instance(self):
        data = dict(self.row_data)
        if self.action == 'U':
            data.update(**self.changed_fields)
        return self._build_model(data)


# class ProcessedAuditLog(models.Model):
#     audit_log = models.OneToOneField(AuditLog, primary_key=True, related_name='processed')
#     timestamp = models.DateTimeField(default=now)
