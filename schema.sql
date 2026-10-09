CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA music;
CREATE SCHEMA app;
CREATE SCHEMA staging;

-- =====================================================================
-- MUSIC
-- =====================================================================

CREATE TABLE music.artists (
    id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE
);

CREATE TABLE music.genres (
    id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE
);


CREATE TABLE music.albums (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title         TEXT NOT NULL,
    release_year  SMALLINT CHECK (release_year BETWEEN 1000 AND 2200),
    UNIQUE NULLS NOT DISTINCT (title, release_year)
);

-- k-means clusters (filled by the offline Python job)
CREATE TABLE music.clusters (
    id        INT PRIMARY KEY,
    centroid  vector(9) NOT NULL,
    label     TEXT,
    size      INT
);

CREATE TABLE music.songs (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title             TEXT NOT NULL,
    album_id          BIGINT REFERENCES music.albums(id),

    -- identifiers
    spotify_track_id  CHAR(22) UNIQUE,
    isrc              CHAR(12) UNIQUE,

    -- raw audio features (0-100 scale unless noted)
    bpm               NUMERIC(6,2) CHECK (bpm > 0),
    camelot           VARCHAR(3)   CHECK (camelot ~ '^(1[0-2]|[1-9])[AB]$'),
    pitch_class       SMALLINT     CHECK (pitch_class BETWEEN 0 AND 11),  -- 0 = C
    mode              SMALLINT     CHECK (mode IN (0, 1)),                -- 1 = major
    time_signature    SMALLINT     CHECK (time_signature BETWEEN 1 AND 7),
    duration_s        INT          CHECK (duration_s > 0),
    loudness_db       NUMERIC(5,2),
    energy            REAL CHECK (energy           BETWEEN 0 AND 100),
    danceability      REAL CHECK (danceability     BETWEEN 0 AND 100),
    acousticness      REAL CHECK (acousticness     BETWEEN 0 AND 100),
    instrumentalness  REAL CHECK (instrumentalness BETWEEN 0 AND 100),
    valence           REAL CHECK (valence          BETWEEN 0 AND 100),
    speechiness       REAL CHECK (speechiness      BETWEEN 0 AND 100),
    liveness          REAL CHECK (liveness         BETWEEN 0 AND 100),
    popularity        SMALLINT CHECK (popularity   BETWEEN 0 AND 100),
    explicit          BOOLEAN NOT NULL DEFAULT FALSE,

    -- standardized feature vector for similarity search (built by trigger)
    features          vector(9),
    cluster_id        INT REFERENCES music.clusters(id) ON DELETE SET NULL,

    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE music.song_artists (
    song_id    BIGINT NOT NULL REFERENCES music.songs(id)   ON DELETE CASCADE,
    artist_id  BIGINT NOT NULL REFERENCES music.artists(id) ON DELETE CASCADE,
    position   SMALLINT NOT NULL DEFAULT 0,   -- 0 = primary artist
    PRIMARY KEY (song_id, artist_id)
);

CREATE TABLE music.song_genres (
    song_id   BIGINT NOT NULL REFERENCES music.songs(id)  ON DELETE CASCADE,
    genre_id  INT    NOT NULL REFERENCES music.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, genre_id)
);

CREATE INDEX ON music.song_artists (artist_id);
CREATE INDEX ON music.song_genres  (genre_id);
CREATE INDEX ON music.songs (album_id);
CREATE INDEX ON music.songs (bpm);
CREATE INDEX ON music.songs (camelot);
CREATE INDEX ON music.songs (cluster_id);

-- nearest-neighbour index (cosine distance).
CREATE INDEX songs_features_hnsw ON music.songs
    USING hnsw (features vector_cosine_ops);

-- =====================================================================
-- VECTORIZING (standardized features, built by trigger)
-- =====================================================================

-- per-feature mean / stddev / weight used to standardize each song
CREATE TABLE music.feature_stats (
    idx     INT PRIMARY KEY,                  -- position in the vector (1-9)
    name    TEXT NOT NULL,
    mean    DOUBLE PRECISION NOT NULL DEFAULT 0,
    stddev  DOUBLE PRECISION NOT NULL DEFAULT 1,
    weight  DOUBLE PRECISION NOT NULL DEFAULT 1   -- hand-tune importance
);

INSERT INTO music.feature_stats (idx, name) VALUES
    (1, 'energy'), (2, 'danceability'), (3, 'acousticness'),
    (4, 'instrumentalness'), (5, 'valence'), (6, 'speechiness'),
    (7, 'liveness'), (8, 'bpm'), (9, 'loudness_db');

-- single place that defines the raw (pre-standardized) features.
-- Skewed features are log-transformed first.
CREATE FUNCTION music.raw_features(s music.songs) RETURNS float8[]
LANGUAGE sql IMMUTABLE AS $$
    SELECT ARRAY[
        s.energy::float8,
        s.danceability::float8,
        s.acousticness::float8,
        ln(1 + s.instrumentalness::float8),
        s.valence::float8,
        ln(1 + s.speechiness::float8),
        ln(1 + s.liveness::float8),
        s.bpm::float8,
        s.loudness_db::float8
    ]
$$;

-- recompute mean/stddev from the data (run after bulk loads)
CREATE FUNCTION music.refresh_feature_stats() RETURNS void
LANGUAGE sql AS $$
    UPDATE music.feature_stats f
    SET mean = x.m, stddev = GREATEST(x.sd, 1e-9)
    FROM (
        SELECT t.idx, avg(t.v) AS m, stddev_pop(t.v) AS sd
        FROM music.songs s,
             LATERAL unnest(music.raw_features(s)) WITH ORDINALITY AS t(v, idx)
        WHERE s.energy IS NOT NULL AND s.danceability IS NOT NULL
          AND s.acousticness IS NOT NULL AND s.instrumentalness IS NOT NULL
          AND s.valence IS NOT NULL AND s.speechiness IS NOT NULL
          AND s.liveness IS NOT NULL AND s.bpm IS NOT NULL
          AND s.loudness_db IS NOT NULL
        GROUP BY t.idx
    ) x
    WHERE f.idx = x.idx;
$$;

CREATE FUNCTION music.build_features() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.energy IS NULL OR NEW.danceability IS NULL OR NEW.acousticness IS NULL
       OR NEW.instrumentalness IS NULL OR NEW.valence IS NULL
       OR NEW.speechiness IS NULL OR NEW.liveness IS NULL
       OR NEW.bpm IS NULL OR NEW.loudness_db IS NULL THEN
        NEW.features := NULL;           -- incomplete rows are left out of search
        RETURN NEW;
    END IF;

    SELECT array_agg(((r.v - f.mean) / f.stddev) * f.weight ORDER BY r.idx)::real[]::vector
    INTO NEW.features
    FROM unnest(music.raw_features(NEW)) WITH ORDINALITY AS r(v, idx)
    JOIN music.feature_stats f USING (idx);

    RETURN NEW;
END $$;

CREATE TRIGGER songs_build_features
BEFORE INSERT OR UPDATE OF energy, danceability, acousticness, instrumentalness,
                           valence, speechiness, liveness, bpm, loudness_db
ON music.songs
FOR EACH ROW EXECUTE FUNCTION music.build_features();

-- =====================================================================
-- USERS
-- =====================================================================

CREATE TABLE app.users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          CITEXT NOT NULL UNIQUE,
    username       CITEXT NOT NULL UNIQUE,
    password       TEXT NOT NULL,              -- never plaintext
    display_name   TEXT,
    avatar_url     TEXT,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff       BOOLEAN NOT NULL DEFAULT FALSE,
    is_superuser   BOOLEAN NOT NULL DEFAULT FALSE,
    last_login     TIMESTAMPTZ,
);

-- replaces the old linked_accounts TEXT column
CREATE TABLE app.linked_accounts (
    user_id           UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    provider          TEXT NOT NULL,           -- e.g. 'spotify'
    provider_user_id  TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, provider),
    UNIQUE (provider, provider_user_id)
);

CREATE TABLE app.playlists (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app.playlist_songs (
    playlist_id  BIGINT NOT NULL REFERENCES app.playlists(id) ON DELETE CASCADE,
    song_id      BIGINT NOT NULL REFERENCES music.songs(id)   ON DELETE CASCADE,
    position     INT NOT NULL,
    added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (playlist_id, song_id)
);

CREATE INDEX ON app.playlists (user_id);