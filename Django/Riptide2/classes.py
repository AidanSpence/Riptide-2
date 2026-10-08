import csv
import re
import datetime
import psycopg
import os
import pandas as pd
import numpy as np
from pathlib import Path
from psycopg import sql

RENAME = {
    'Song': 'title', 'Artist': 'artists', 'BPM': 'bpm', 'Camelot': 'camelot',
    'Energy': 'energy', 'Duration': 'duration', 'Popularity': 'popularity',
    'Genres': 'genres', 'Album': 'album', 'Album Date': 'album_date',
    'Dance': 'danceability', 'Acoustic': 'acousticness',
    'Instrumental': 'instrumentalness', 'Valence': 'valence',
    'Speech': 'speechiness', 'Live': 'liveness', 'Loud (Db)': 'loudness_db',
    'Time Signature': 'time_signature', 'Spotify Track Id': 'spotify_track_id',
    'ISRC': 'isrc', 'Explicit': 'explicit',
}


class Cleaning:
    BASE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}

    REPLACEMENTS = [
        ('â™¯', '#'), ('â™\xad­', 'b'), ('â™®', ''),
        ('â™', 'b'),
        ('♯', '#'), ('♭', 'b'), ('♮', ''),
        ('\xad', ''), ('\xa0', ' ')]

    def __init__(self, filename: str):
        self.file = filename

# ___________TEXT____________

    @staticmethod
    def fix_bugged_char(s):
        if not isinstance(s, str):
            return s
        try:
            return s.encode('cp1252').decode('utf-8')
        except (UnicodeDecodeError, UnicodeEncodeError):
            return s

    @staticmethod
    def normalize(s):
        for old, new in Cleaning.REPLACEMENTS:
            s = s.replace(old, new)
        return s.strip()


# ___________KEY____________

    @staticmethod
    def parse_spelling(n):
        m = re.fullmatch(r'([A-Ga-g])([#b]*)', n)
        if not m:
            raise ValueError(f"Unrecognized note: {n!r}")
        letter, acc = m.groups()
        return (Cleaning.BASE[letter.upper()] + acc.count('#') - acc.count('b')) % 12

    def parse_key(self, s):
        if pd.isna(s):
            return None
        try:
            note_part, mode = self.normalize(s).rsplit(' ', 1)
        except ValueError:
            raise ValueError(f"Unrecognized key format: {s!r}")
        mode = mode.lower()
        if mode not in ('major', 'minor'):
            raise ValueError(f"Unrecognized mode in {s!r}")
        pitches = {self.parse_spelling(n) for n in note_part.split('/')}
        if len(pitches) > 1:
            raise ValueError(f"Inconsistent spellings in {s!r}: {pitches}")
        return pitches.pop(), int(mode == 'major')

    def encode(self, s):
        try:
            return self.parse_key(s)
        except ValueError as e:
            print(f'Key set to NULL: {e}')
            return None


# ___________DATES____________

    @staticmethod
    def parse_date(s):
        if pd.isna(s):
            return None, None, None
        s = str(s).strip()
        # Checks if data is year month day defaults to 0 if only year or year month e.g (1999 0 0)
        m = re.fullmatch(r'(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?', s)
        if m:
            y, mo, d = int(m[1]), int(m[2] or 0), int(m[3] or 0)
        else:
            # if order is day month year
            m = re.fullmatch(r'(\d{1,2})/(\d{1,2})/(\d{4})', s)
            if not m:
                return None, None, None
            d, mo, y = int(m[1]), int(m[2]), int(m[3])
        try:
            if mo == 0 or (mo == 1 and d in (0, 1)):
                return datetime.date(y, 1, 1), 'year', y
            if d == 0:
                return datetime.date(y, mo, 1), 'year', y
            return datetime.date(y, mo, d), 'day', y
        except ValueError:
            return None, None, y


# ___________OTHER____________

    @staticmethod
    def split_artists(s):
        if pd.isna(s):
            return None

        parts = [p.strip()for p in re.split(r',(?!\s)', s) if p.strip()]
        return '|'.join(parts)

    @staticmethod
    def split_genres(s):
        if pd.isna(s) or not str(s).strip():
            return None
        return '|'.join(g.strip() for g in str(s).split(',') if g.strip())



    def clean(self):
        df = pd.read_csv(self.file, encoding="utf-8")
        df = df.drop(columns=['#','Added At'], errors='ignore').rename(columns=RENAME)

        for c in ['title', 'artists', 'album', 'genres']:
            df[c] = df[c].map(self.fix_bugged_char)

        # Convert Duration, Explicit and Key to correct values
        dur = df['duration'].astype('str')
        # Catch for times not HH:MM:SS
        dur = dur.where(dur.str.count(':') == 2, '00:' + dur)
        df['duration'] = pd.to_timedelta(dur).dt.total_seconds().round().astype('int64')

        df['explicit'] = (df['explicit'].str.lower().map({'yes': True, 'no': False}).fillna(False).astype(bool))

        keys = df['Key'].map(self.encode)
        df['pitch'] = keys.map(lambda k: k[0] if k else None).astype('int64')
        df['mode'] = keys.map(lambda k: k[1] if k else None).astype('int64')
        df = df.drop(columns='Key')

        d = df['album_date'].map(self.parse_date)
        df['release_date'] = d.map(lambda t: t[0])
        df['release_prescision'] = d.map(lambda t: t[1])
        df['release_year'] = d.map(lambda t: t[2]).astype('int64')
        df = df.drop(columns='album_date')

        df["artists"] = df['artists'].map(self.split_artists)
        comma_names = sorted({a for cell in df['artists'].dropna()
                              for a in cell.split('|') if "," in a})
        if comma_names:
            print("REAL NAMES??")
            for n in comma_names:
                print(" ", n)
        df['genres'] = df['genres'].map(self.split_genres)
        df['isrc'] = df['isrc'].str.strip().str.upper()
        df["spotify_track_id"] = df["spotify_track_id"].str.strip()

        for c in ['energy', 'danceability', 'acousticness', 'instrumentalness',
                  'valence', 'speechiness', 'liveness', 'popularity']:
            assert df[c].between(0,100).all(), f"{c} out of 0-100"

        # check for duplicates
        dupes = df[df.duplicated('spotify_track_id', keep=False)]
        if len(dupes):
            print("duplicate track id:\n", dupes[['title']].to_string())

        # Save file to clean version
        df.to_csv("clean_"+ self.file, index=False)
        return "clean_"+ self.file

class SongUploader:

    LOCK_ID = 664486


    # POSTGRES CODE

    STAGING_COLUMNS = {
        'title': 'TEXT',
        'artists': 'TEXT',            
        'bpm': 'NUMERIC(6,2)',
        'camelot': 'TEXT',
        'energy': 'REAL',
        'duration_s': 'INT',
        'popularity': 'SMALLINT',
        'genres': 'TEXT',               
        'album': 'TEXT',
        'danceability': 'REAL',
        'acousticness': 'REAL',
        'instrumentalness': 'REAL',
        'valence': 'REAL',
        'speechiness': 'REAL',
        'liveness': 'REAL',
        'loudness_db': 'NUMERIC(5,2)',
        'time_signature': 'SMALLINT',
        'spotify_track_id': 'TEXT',
        'isrc': 'TEXT',
        'explicit': 'BOOLEAN',
        'pitch_class': 'SMALLINT',
        'mode': 'SMALLINT',
        'release_date': 'DATE',
        'release_precision': 'TEXT',
        'release_year': 'SMALLINT',
    }
    REQUIRED = {'title', 'spotify_track_id'}

 
    INSERT_ARTISTS = """
        INSERT INTO music.artists (name)
        SELECT DISTINCT btrim(a)
        FROM staging_songs, unnest(string_to_array(artists, '|')) AS a
        WHERE spotify_track_id IS NOT NULL AND btrim(a) <> ''
        ON CONFLICT (name) DO NOTHING
    """
 
    INSERT_GENRES = """
        INSERT INTO music.genres (name)
        SELECT DISTINCT btrim(g)
        FROM staging_songs, unnest(string_to_array(genres, '|')) AS g
        WHERE spotify_track_id IS NOT NULL AND genres IS NOT NULL AND btrim(g) <> ''
        ON CONFLICT (name) DO NOTHING
    """
 
    INSERT_ALBUMS = """
        INSERT INTO music.albums (title, release_year)
        SELECT DISTINCT album, release_year
        FROM staging_songs
        WHERE spotify_track_id IS NOT NULL AND album IS NOT NULL
        ON CONFLICT (title, release_year) DO NOTHING
    """

    INSERT_SONGS = """
        WITH ins AS (
            INSERT INTO music.songs (
                title, album_id, spotify_track_id, isrc, bpm, camelot, pitch_class, mode,
                time_signature, duration_s, loudness_db, energy, danceability,
                acousticness, instrumentalness, valence, speechiness, liveness,
                popularity, explicit)
            SELECT
                s.title, a.id, s.spotify_track_id, s.isrc, s.bpm, s.camelot,
                s.pitch_class, s.mode, s.time_signature, s.duration_s, s.loudness_db,
                s.energy, s.danceability, s.acousticness, s.instrumentalness,
                s.valence, s.speechiness, s.liveness, s.popularity,
                COALESCE(s.explicit, FALSE)
            FROM staging_songs s
            LEFT JOIN music.albums a
                   ON a.title = s.album
                  AND a.release_year IS NOT DISTINCT FROM s.release_year
            WHERE s.spotify_track_id IS NOT NULL
            ON CONFLICT DO NOTHING          -- skips duplicate Spotify id OR ISRC
            RETURNING id, spotify_track_id
        )
        INSERT INTO tmp_new_songs (song_id, spotify_track_id)
        SELECT id, spotify_track_id FROM ins
    """
 
    LINK_ARTISTS = """
        INSERT INTO music.song_artists (song_id, artist_id, position)
        SELECT n.song_id, ar.id, (x.ord - 1)::smallint
        FROM tmp_new_songs n
        JOIN staging_songs s ON s.spotify_track_id = n.spotify_track_id
        CROSS JOIN LATERAL unnest(string_to_array(s.artists, '|'))
                           WITH ORDINALITY AS x(name, ord)
        JOIN music.artists ar ON ar.name = btrim(x.name)
        ON CONFLICT DO NOTHING
    """
 
    LINK_GENRES = """
        INSERT INTO music.song_genres (song_id, genre_id)
        SELECT n.song_id, g.id
        FROM tmp_new_songs n
        JOIN staging_songs s ON s.spotify_track_id = n.spotify_track_id
        CROSS JOIN LATERAL unnest(string_to_array(s.genres, '|')) AS x(name)
        JOIN music.genres g ON g.name = btrim(x.name)
        WHERE s.genres IS NOT NULL
        ON CONFLICT DO NOTHING
    """
 
    ASSIGN_CLUSTERS = """
        UPDATE music.songs so
        SET cluster_id = (SELECT c.id FROM music.clusters c
                          ORDER BY c.centroid <-> so.features LIMIT 1)
        FROM tmp_new_songs n
        WHERE so.id = n.song_id
          AND so.features IS NOT NULL
          AND EXISTS (SELECT 1 FROM music.clusters)
    """
 
    STATS_ARE_PLACEHOLDERS = """
        SELECT COALESCE(bool_and(mean = 0 AND stddev = 1), TRUE)
        FROM music.feature_stats
    """

    def __init__(self, dsn: str = None):
        self.dsn = dsn or os.environ.get('DATABASE_URL')
        if not self.dsn:
            raise RuntimeError("set the DATABASE_URL enviroment variable")

    def read_header(self, path: Path):
        """reads the first line and checks the column names are all matching."""
        with open(path, encoding='utf-8') as f:
            header = f.readline().strip().split(",")
        unknown = set(header) - set(self.STAGING_COLUMNS)
        if unknown:
            raise ValueError(f"Unexpected csv columns: {sorted(unknown)}")
        missing = self.REQUIRED - set(header)
        if missing:
            raise ValueError(f"CSV is missing columns: {sorted(missing)}")
        return header

    def create_staging(self, cur):
        """makes two temporary tables that vanish when the load ends:"""
        cols = sql.SQL(', ').join(
            sql.SQL("{} {}").format(sql.Identifier(c), sql.SQL(t))
            for c, t in self.STAGING_COLUMNS.items())
        cur.execute(sql.SQL(
            'CREATE TEMP TABLE staging_songs ({}) ON COMMIT DROP').format(cols))
        cur.execute('CREATE TEMP TABLE tmp_new_songs '
                    '(song_id BIGINT, spotify_track_id TEXT) ON COMMIT DROP')

    def copy_csv(self, cur, path: Path, header):
        """inputs the file into staging_songs (temp table) using Postgres's COPY."""
        state = sql.SQL('COPY staging_songs ({}) FROM STDIN with (FORMAT csv, HEADER true)').format(
            sql.SQL(", ").join(sql.Identifier(c) for c in header))
        # opens csv file as binary then bulk uploads directly into postgres db
        with open(path, 'rb') as f, cur.copy(state) as copy:
            while chunk := f.read(65536):
                copy.write(chunk)

    def load(self, path, clean: bool = True) -> dict:
        """Optionally run Cleaning, then check the header for correct columns.
        "load in progress" flag. Extra uploads wait for the first to finish.
        Create the temporary tables and copy the CSV into staging.
        Insert any new artists, genres and albums.
        Insert the songs. Songs with a Spotify id or ISRC already in the database are skipped.
        Link artists and genres
        Rebuild all vectors.
        Put each new song into its nearest cluster
        Return a summary: rows in the file, rows inserted, rows skipped."""
        csv_path = Path(Cleaning(str(path)).clean()) if clean else Path(path)
        header = self.read_header(csv_path)

        revectorized = False
        # pushs new songs of success, cancels and resets if error
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                # "load in progress" flag
                cur.execute('SELECT pg_advisory_xact_lock(%s)' (self.LOCK_ID))
                self.create_staging(cur)
                self.copy_csv(cur, csv_path, header)

                cur.execute('SELECT count(*) FROM staging_songs')
                rows_in_file = cur.fetchone()[0]

                cur.execute(self.INSERT_ARTISTS)
                cur.execute(self.INSERT_GENRES)
                cur.execute(self.INSERT_ALBUMS)
                cur.execute(self.INSERT_SONGS)
                inserted = cur.rowcount
                cur.execute(self.LINK_ARTISTS)
                cur.execute(self.LINK_GENRES)

                cur.execute(self.STATS_ARE_PLACEHOLDERS)
                if inserted and cur.fetchone()[0]:
                    cur.execute('SELECT music.refresh_feature_stats()')
                    cur.execute('UPDATE music.songs SET energy = energy')
                    revectorized = True

                cur.execute(self.ASSIGN_CLUSTERS)

            if revectorized:
                with psycopg.connect(self.dsn, autocommint=True) as conn:
                    conn.execute('REINDEX INDEX CONCURRENTLY music.songs_features_hnsw')

            return{
                'rows_in_file': rows_in_file,
                'inserted': inserted,
                'skipped': rows_in_file - inserted,
                'revectorized': revectorized,
                'clean_csv' : str(csv_path)
            }

    def rebuild_vectors(self) -> None:
        """Standardization stats and every song's vector recalculated
        
        Should only be run ocassionaly when low usage or libary has doubled"""
        with psycopg.connect(self.dsn) as conn:
            conn.execute('SELECT pg_advisory_xact_lock(%s)', (self.LOCK_ID))
            conn.execute('SELECT music.refresh_feature_stats()')
            conn.execute('UPDATE music.songs SET energy = energy')
        with psycopg.connect(self.dsn, autocommint= True) as conn:
            conn.execute('REINDEX INDEX CONCURRENTLY music.songs_features_hnsw')
            

if __name__ == '__main__':
    # for clean file
    loader = SongUploader()
    cleaned = Cleaning('merged.csv').clean()
    print(loader.load(cleaned, clean=False))


    # for unclean file
    loader = SongUploader()
    print(loader.load('merged.csv'))
