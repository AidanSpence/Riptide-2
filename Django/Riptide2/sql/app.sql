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
    last_login     TIMESTAMPTZ
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

CREATE TABLE app.user_chats (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON app.playlists (user_id);