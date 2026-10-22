from django.db import models

class CIEmailField(models.EmailField):
    def db_type(self, connection):
        return "citext"

class CICharField(models.CharField):
    def db_type(self, connection):
        return "citext"