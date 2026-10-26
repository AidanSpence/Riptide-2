import math
from pgvector.django import vector
from django.db import connection

FEATURE_ORDER = [
    "energy",
    "danceability",
    "acousticness",
    "instrumentalness",
    "valence",
    "speechiness",
    "liveness",
    "bpm",
    "loudness_db",
]

def build_target_vector(audio_features):
    with connection.cursor() as cur:
        cur.execute("""SELECT name, mean, stddev, weight
        "FROM music.feature_stats
        ORDER BY idx""")
        stats = {
            name: (mean, stddev, weight)
            for name, mean, stddev, weight
            in cur.fetchall()
        }

    target = []

    for name in FEATURE_ORDER:
        mean, stddev, weight = stats[name]
        preference = audio_features.get(name)

        if preference is None:
            target.append(0.0)
            continue

        value = preference["target"]

        if name in {
            "energy", "danceability", "acousticness",
            "instrumentalness", "valence",
            "speechiness", "liveness"
        }:
            value *= 100.0

        if name in {
            "instrumentalness", "speechiness", "liveness"
        }:
            value = math.log1p(value)

        standardized = (value - mean) / stddev
        target.append(standardized * weight)

    return vector(target)
