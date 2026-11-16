"""use known reference songs to guide the recommendation search."""

from copy import deepcopy
import logging
import math

from django.db import connection

logger = logging.getLogger(__name__)

UNIT_FEATURES = (
    "energy", "danceability", "acousticness", "instrumentalness",
    "valence", "speechiness", "liveness",
)
FEATURES = (*UNIT_FEATURES, "bpm", "loudness_db")
MAX_REFERENCES = 75


def find_reference_songs(references):
    """match title - artist against actual database credits, ignoring case."""
    references = list(dict.fromkeys(
        ref.strip().lower() for ref in references if isinstance(ref, str) and ref.strip()
    ))[:MAX_REFERENCES]
    if not references:
        return []

    # build the comparison from database values so hyphens in names are safe
    # feature column names are constants; user input stays in query parameters
    columns = ", ".join(f"s.{feature}" for feature in FEATURES)
    with connection.cursor() as cursor:
        cursor.execute(f"""
            SELECT s.id, s.title, {columns},
                ARRAY(
                    SELECT a.name
                    FROM music.song_artists sa
                    JOIN music.artists a ON a.id = sa.artist_id
                    WHERE sa.song_id = s.id
                    ORDER BY sa.position, a.id
                ) AS artists
            FROM music.songs s
            WHERE EXISTS (
                SELECT 1
                FROM music.song_artists sa
                JOIN music.artists a ON a.id = sa.artist_id
                WHERE sa.song_id = s.id
                  AND lower(btrim(s.title) || ' - ' || btrim(a.name)) = ANY(%s::text[])
            )
            ORDER BY s.id
        """, [references])
        names = [column[0] for column in cursor.description]
        candidates = [dict(zip(names, row)) for row in cursor.fetchall()]

    matches = {}
    for reference in references:
        found = [song for song in candidates if any(
            f"{song['title'].strip()} - {artist.strip()}".lower() == reference
            for artist in song["artists"]
        )]
        # don't silently choose between multiple recordings with the same credits
        if len(found) == 1:
            matches[found[0]["id"]] = found[0]
    return list(matches.values())


def apply_reference_features(ai_data):
    """fill feature targets from references, keeping explicit user changes."""
    plan = deepcopy(ai_data)
    search = plan.setdefault("search", {})
    references = search.get("reference_tracks") or []
    songs = find_reference_songs(references)
    if not songs:
        return plan

    overrides = set(search.get("reference_overrides") or [])
    preferences = search.setdefault("audio_features", {})
    for feature in FEATURES:
        if feature in overrides:
            continue
        values = []
        for song in songs:
            value = song.get(feature)
            if value is not None and math.isfinite(float(value)):
                values.append(float(value))
        if not values:
            continue

        target = sum(values) / len(values)
        if feature in UNIT_FEATURES:
            target /= 100.0

        # replace guessed targets and bounds with a measured, soft preference
        preferences[feature] = {
            "target": target,
            "min": None,
            "max": None,
            "weight": 0.6,
            "confidence": 1.0,
        }

    logger.info("Matched %s distinct database songs from %s references", len(songs), len(references))
    return plan
