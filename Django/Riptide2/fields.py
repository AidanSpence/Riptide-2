from django.db import models

class CIEmailField(models.EmailField):
    """case insensitive postgres email field."""
    def db_type(self, connection):
        return "citext"

class CICharField(models.CharField):
    """case insensitive postgres text field."""
    def db_type(self, connection):
        return "citext"