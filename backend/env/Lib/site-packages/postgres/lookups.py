from django.db.models.lookups import BuiltinLookup


class PostgresLookup(BuiltinLookup):
    def process_lhs(self, qn, connection, lhs=None):
        lhs = lhs or self.lhs
        return qn.compile(lhs)

    def get_rhs_op(self, connection, rhs):
        return '%s %s' % (self.operator, rhs)
