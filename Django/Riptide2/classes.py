import sqlite3
import struct
import csv
import re
import datetime
import pandas as pd
import numpy as np


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
        m = re.fullmatch(r'(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?', s)
        if m:
            y, mo, d = int(m[1]), int(m[2] or 0), int(m[3] or 0)
        else:
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

class PostgreSQLImport:
    def __init__(self):
        pass


if __name__ == '__main__':
    cleaner = Cleaning('merged.csv')
    print(cleaner.clean())