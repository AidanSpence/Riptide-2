from django.db import connection
from .target_vector import build_target_vector

# constraints.required_features -> SQL (values use the database's 0-100 scale)
REQUIRED_FEATURE_SQL = {
    "four_four": "s.time_signature = 4",
    "instrumental": "s.instrumentalness >= 50",
    "vocal_led": "s.instrumentalness < 20",
    "danceable": "s.danceability >= 55",
}


def retrieve_candidates(ai_result, candidate_limit=500):
    search = ai_result.get("search") or {}
    constraints = ai_result.get("constraints") or {}

    features = search.get("audio_features") or {}
    vector = build_target_vector(features)

    # an all-zero vector has no direction so cosine distance is NaN.
    # fall back to popularity ordering when the AI gave no usable targets.
    use_vector = any(abs(x) > 1e-12 for x in vector)

    years = search.get("release_years") or {}
    min_year = years.get("min")
    max_year = years.get("max")

    excluded_artists = [
        name.casefold() for name in (search.get("exclude_artists") or [])
    ]

    allow_explicit = constraints.get("explicit_content")
    if allow_explicit is None:
        allow_explicit = True

    # optional filters (only added when the AI asked for them)
    extra_sql = ""
    extra_params = []

    musical = search.get("musical_filters") or {}

    mode = musical.get("mode")
    if mode in ("major", "minor"):
        extra_sql += " AND s.mode = %s"
        extra_params.append(1 if mode == "major" else 0)

    time_signature = musical.get("time_signature")
    if time_signature:
        extra_sql += " AND s.time_signature = %s"
        extra_params.append(int(time_signature))

    camelot_keys = [
        str(k).strip().upper() for k in (musical.get("camelot_keys") or [])
    ]
    if camelot_keys:
        extra_sql += " AND s.camelot = ANY(%s::text[])"
        extra_params.append(camelot_keys)

    for name in constraints.get("required_features") or []:
        clause = REQUIRED_FEATURE_SQL.get(name)   # unknown names are ignored
        if clause:
            extra_sql += f" AND {clause}"

    # vector vs popularity ordering
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
            s.duration_s, s.spotify_track_id,
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
            {extra_sql}
        ORDER BY {order_sql}
        LIMIT %s
    """

    
    params = []
    if use_vector:
        params.append(vec_text)
    # order must match the placeholders in the SQL above top to bottom.
    params += [
        allow_explicit,
        min_year, min_year,
        max_year, max_year,
        excluded_artists,
    ]
    params += extra_params
    if use_vector:
        params.append(vec_text)
    params.append(candidate_limit)

    with connection.cursor() as cur:
        cur.execute(sql, params)
        columns = [column[0] for column in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]