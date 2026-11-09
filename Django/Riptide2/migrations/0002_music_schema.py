from pathlib import Path
from django.db import migrations

SQL = (Path(__file__).resolve().parent.parent / "sql" / "music.sql").read_text(encoding="utf-8")


class Migration(migrations.Migration):
    dependencies = [("Riptide2", "0001_initial")]
    operations = [
        migrations.RunSQL([SQL], reverse_sql="DROP SCHEMA IF EXISTS music CASCADE;"),
    ]