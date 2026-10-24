from django.db import connection
from .target_vector import build_target_vector

def retrieve_candidates(ai_result, candidate_limit=500):
    search = ai_result["search"]
    constraints = ai_result["constraints"]

    target = (
        search.get("audio_features", {})
    )

    # convert to pgvector format
    target_vector = build_target_vector(ai_result)
    target_vector = (
        "[" + ",".join(str(float(x)) for x in target_vector) + "]"
    )

    years = search.get("release_years", {})
    min_year = years.get("min")
    max_year = years.get("max")

    excluded_artists = [
        name.casefold()
        for name in search.get("exclude_artists", [])
    ]

    allow_explicit = constraints.get("explicit_content")
    if allow_explicit is None:
        allow_explicit = True

    sql = """
        SELECT
            s.id,
            s.title,
            s.bpm,
            s.energy,
            s.valence,
            s.popularity,
            s.cluster_id,
            s.features <=> %s::vector AS distance,
            al.release_year
        FROM music.songs AS s
        LEFT JOIN music.albums AS al
            ON al.id = s.album_id
        WHERE
            s.features IS NOT NULL
            AND (%s IS NULL or %s = TRUE OR s.explicit = FALSE)
            AND (%s IS NULL OR al.release_year >= %s)
            AND (%s IS NULL OR al.release_year <= %s)
            AND NOT EXISTS (
                SELECT 1
                FROM music.song_artists AS sa
                JOIN music.artists AS a
                    ON a.id = sa.artist_id
                WHERE sa.song_id = s.id
                  AND lower(a.name) = ANY(%s)
            )
        ORDER BY s.features <=> %s::vector
        LIMIT %s
    """ 

    params = [
        target_vector,
        allow_explicit, allow_explicit,
        min_year, min_year,
        max_year, max_year,
        excluded_artists,
        target_vector,
        candidate_limit
    ]

    with connection.cursor() as cur:
        cur.execute(sql, params)
        columns = [
            column[0] for column in cur.description
        ]
        return [
            dict(zip(columns, row))
            for row in cur.fetchall()
        ]
