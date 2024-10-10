"""
Creates a migration in the app, which contains an operation that
turns on auditing for the provided model(s).

Leverage makemigrations, to get the file created.
Then, inject into that an import, a dependency and the
relevant operation(s).
"""
from optparse import make_option
import sys

from django.apps import apps
from django.core.management.base import BaseCommand
from django.core.management.commands.makemigrations import Command as MakeMigrations
from django.db.migrations import Migration
from django.db.migrations.loader import MigrationLoader
from django.db.migrations.autodetector import MigrationAutodetector
from django.db.migrations.questioner import InteractiveMigrationQuestioner
from django.db.migrations.state import ProjectState

import postgres.audit.operations


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--dry-run', action='store_true', dest='dry_run', default=False,
            help="Just show what migrations would be made; don't actually write them."),
    )
    
    def handle(self, app_label, *models, **options):
        self.verbosity = int(options.get('verbosity'))
        self.interactive = options.get('interactive')
        self.dry_run = options.get('dry_run', False)
        
        if not models and '.' in app_label:
            app_label, models = app_label.split('.', 1)
            models = [models]
        
        try:
            apps.get_app_config(app_label)
        except LookupError:
            self.stderr.write("App '%s' could not be found. Is it in INSTALLED_APPS?" % app_label)
            sys.exit(2)
        
        # We want to basically write an empty migration, but with some
        # extra bits.
        
        # Load the current graph state. Pass in None for the connection so
        # the loader doesn't try to resolve replaced migrations from DB.
        loader = MigrationLoader(None)
        
        # Set up autodetector
        autodetector = MigrationAutodetector(
            loader.project_state(),
            ProjectState.from_apps(apps),
            InteractiveMigrationQuestioner(specified_apps=[app_label]),
        )
        
        changes = autodetector.arrange_for_graph({
            app_label: [Migration("audit_tables", app_label)]
        }, loader.graph)
        
        migration = changes[app_label][0]
        migration.dependencies.append(
            ('audit', '0001_initial')
        )
        migration.name = 'audit_%s' % ('_'.join(models[:3]))
        
        for model_name in models:
            model = apps.get_model(app_label, model_name)
            migration.operations.append(postgres.audit.operations.AuditModel(model))
        
        self.write_migration_files(changes)
    
    def write_migration_files(self, changes):
        other = MakeMigrations()
        other.verbosity = self.verbosity
        other.interactive = self.interactive
        other.dry_run = self.dry_run
        other.stderr = self.stderr
        other.stdout = self.stdout
        
        other.write_migration_files(changes)