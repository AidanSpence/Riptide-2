import os
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings


class Command(BaseCommand):
    help = "prepare the database before starting this single-instance deployment"

    def handle(self, *args, **options):
        # serialize startup migrations, including replacement instances
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_advisory_lock(782061)")
            try:
                # citext must exist before the initial user migration
                cursor.execute("CREATE EXTENSION IF NOT EXISTS citext SCHEMA public")
                cursor.execute("CREATE EXTENSION IF NOT EXISTS vector SCHEMA public")
                cursor.execute("CREATE SCHEMA IF NOT EXISTS app")
                call_command("migrate", interactive=False)
                call_command("createcachetable")
                if os.getenv("BOOTSTRAP_MUSIC", "0") == "1":
                    cursor.execute("SELECT count(*) FROM music.songs")
                    if cursor.fetchone()[0] == 0:
                        call_command("load_songs", str(settings.BASE_DIR / "data/clean_merged.csv"), no_clean=True)
                    cursor.execute("SELECT count(*) FROM music.clusters")
                    if cursor.fetchone()[0] == 0:
                        call_command("build_clusters", k=20)
            finally:
                cursor.execute("SELECT pg_advisory_unlock(782061)")
