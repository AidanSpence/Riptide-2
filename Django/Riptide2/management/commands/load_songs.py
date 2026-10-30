from pathlib import Path
from django.core.management.base import BaseCommand, CommandError

from Django.Riptide2.services.file_cleaning import SongUploader

class Command(BaseCommand):
    help = "Load songs from a CSV into DB" # Visible with 'python manage.py help <command>'

    def add_arguments(self, parser):
        parser.add_argument("csv_path", help="Path to CSV file")
        parser.add_argument("--no-clean", action="store_true", help="Skip cleaning step")
        parser.add_argument("--rebuild-vectors", action="store_true", help="recaluclate stats and vectors")

    def handle(self, *args, **options):
        loader = SongUploader()

        if options["rebuild_vectors"]:
            loader.rebuild_vectors()
            self.stdout.write(self.style.SUCCESS("Vectors rebuilt"))
            return

        path = Path(options["csv_path"])
        if not path.exists():
            raise CommandError("File not found")

        result = loader.load(path, clean=not options["no_clean"])
        self.stdout.write(self.style.SUCCESS(str(result)))