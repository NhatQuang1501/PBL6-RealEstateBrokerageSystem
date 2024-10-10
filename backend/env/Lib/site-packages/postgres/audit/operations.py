from django.db.migrations.operations.base import Operation

AUDIT_TRIGGER_ROW = """CREATE TRIGGER 
    audit_trigger_row 
AFTER INSERT OR UPDATE OR DELETE ON
    "%(table)s"
FOR EACH ROW EXECUTE PROCEDURE 
    __audit.if_modified_func('%(log_query)s' %(ignored_columns)s);
"""

AUDIT_TRIGGER_STM="""CREATE TRIGGER
    audit_trigger_stm
AFTER TRUNCATE ON
    "%(table)s"
FOR EACH STATEMENT EXECUTE PROCEDURE
    __audit.if_modified_func('%(log_query)s');
"""

DROP_TRIGGER='DROP TRIGGER audit_trigger_%s ON "%s";'

class AuditTable(Operation):
    def __init__(self, table, log_query=True, ignored_columns=None):
        self.table = table
        self.log_query = log_query
        if ignored_columns:
            self.ignored_columns = [''] + list(ignored_columns)
        else:
            self.ignored_columns = []
    
    @property
    def reversible(self):
        return True
    
    def state_forwards(self, app_label, state):
        pass
    
    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        data = {
            'table': self.table,
            'log_query': 't' if self.log_query else 'f',
            'ignored_columns': ', '.join(self.ignored_columns)
        }
        
        schema_editor.execute(AUDIT_TRIGGER_ROW % data)
        schema_editor.execute(AUDIT_TRIGGER_STM % data)
    
    def state_backwards(self, app_label, state):
        pass
    
    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        schema_editor.execute(DROP_TRIGGER % ('row', self.table))
        schema_editor.execute(DROP_TRIGGER % ('stm', self.table))

def AuditModel(model, log_query=True, ignored_columns=None):
    return AuditTable(model._meta.db_table, log_query, ignored_columns)