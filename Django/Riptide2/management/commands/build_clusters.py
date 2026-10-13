import numpy as np
import psycopg
from django.core.management.base import BaseCommand
from sklearn.cluster import KMeans

from Riptide2.classes import django_dsn

class Command(BaseCommand):
    help =  "Run k-means on music.songs.features and fill music clusters / songs.clusters_id" # Visible with 'python manage.py help <command>'

    def add_arguments(self, parser):
        parser.add_argument("--k", type=int, default=20, help="num clusters")

    def handle(self, *args, **options):
        k = options["k"]
        with psycopg.connect(django_dsn()) as conn:
            rows = conn.execute(
                "SELECT id, features::text FROM music.songs WHERE features IS NOT NULL"
            ).fetchall()
            ids = [r[0] for r in rows]
            X = np.array([float(v) for v in r[1].strip("[]").split(",")] for r in rows)
            self.stdout.write(f"Clustering {len(ids)} songs into {k} clusters")

            km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X)

            conn.execute("UPDATE music.songs SET cluster_id = NULL")
            conn.execute("DELETE FROM music.clusters")
            for i, center in enumerate(km.cluster_centers_):
                vec = "[" + ",".join(f"{c:.6f}" for c in center) + "]"
                size = int((km.labels_ == i).sum())
                conn.execute(
                    "INSERT INTO music.clusters (id, centriod, size) VALUES (%s, %s::vector, %s)",
                    (i, vec, size)
                )
            with conn.cursor as cur:
                cur.executemany(
                    "UPDATE music.songs SET cluster_id = %s WHERE id = %s",
                    [(int(l), int(i)) for i, l in zip(ids, km.labels_)],
                )
        self.stdout.write(self.style.SUCCESS("Done."))
