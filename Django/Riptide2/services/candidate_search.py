from django.db import connection
from .target_vector import build_target_vector

def retrieve_candidates(ai_result, candidate_limit=500):
    search = ai_result["search"]
    constraints = ai_result["constraints"]

    features = search.get("audio_features", {})
    vector = build_target_vector(features)

    use_vector = any(abs(x) > 1e-12 for x in vector)

    years = search.get("release_years, {}") or {}
    min_year = years.get("min")
    max_year = years.get("max")

    excluded_artists = [
        name.casefold()
        for name in search.get("exclude_artists", [])
    ]

    allow_explicit = constraints.get("explicit_content")
    if allow_explicit is None:
        allow_explicit = True

    if use_vector:
        vec_text = "[" + ",".join(str(float(x)) for x in vector) + "]"
        distance_sql = "s.features <=> %s::vector"
        order_sql = "s.features <=> %s::vector"
    else:
        distance_sql = "NULL::float8"
        order_sql = "s.popularity DESC NULLS LAST"


    sql = f"""
        SELECT
            s.id, s.title, s.bpm, s.energy, s.danceability, s.acousticness,
            s.instrumentalness, s.valence, s.speechiness, s.liveness,
            s.loudness_db, s.popularity, s.explicit, s.cluster_id, 
            duration_s, spotify_track_id,
            {distance_sql} AS distance,
            al.release_year,
            ARRAY(
                SELECT a.name
                FROM music.song_artists sa
                JOIN music.artists a ON a.id = sa.artist_id
                WHERE sa.song_id = s.id
                ORDER BY sa.position
            ) AS artists,
            ARRAY(
                SELECT g.name
                FROM music.song_genres sg
                JOIN music.genres g ON g.id = sg.genre_id
                WHERE sg.song_id = s.id
            ) AS genres
        FROM music.songs AS s
        LEFT JOIN music.albums AS al ON al.id = s.album_id
        WHERE
            s.features IS NOT NULL
            AND (%s::boolean = TRUE OR s.explicit = FALSE)
            AND (%s::int IS NULL OR al.release_year >= %s::int)
            AND (%s::int IS NULL OR al.release_year <= %s::int)
            AND NOT EXISTS (
                SELECT 1
                FROM music.song_artists AS sa
                JOIN music.artists AS a ON a.id = sa.artist_id
                WHERE sa.song_id = s.id
                  AND lower(a.name) = ANY(%s::text[])
            )
        ORDER BY {order_sql}
        LIMIT %s
    """

    params = []
    if use_vector:
        params.append(vec_text)
    params += [
        allow_explicit,
        min_year, min_year,
        max_year, max_year,
        excluded_artists,
    ]
    if use_vector:
        params.append(vec_text)
    params.append(candidate_limit)


    with connection.cursor() as cur:
        cur.execute(sql, params)
        columns = [
            column[0] for column in cur.description
        ]
        return [
            dict(zip(columns, row))
            for row in cur.fetchall()
        ]
