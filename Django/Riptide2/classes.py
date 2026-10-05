import sqlite3
import struct
import csv
import re
import pandas as pd
import numpy as np


class Cleaning:
    def __init__(self, filename: str):
        self.file = filename

    BASE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}

    REPLACEMENTS = [
        ('â™¯', '#'), ('â™­', 'b'), ('â™®', ''),
        ('â™', 'b'),
        ('♯', '#'), ('♭', 'b'), ('♮', ''),
        ('\xad', '')]

    @staticmethod
    def normalize(s):
        for old, new in Cleaning.REPLACEMENTS:
            s = s.replace(old, new)
        return s.strip()
    
    @staticmethod
    def parse_spelling(n):
        m = re.fullmatch(r'([A-Ga-g])([#b]*)', n)
        if not m:
            raise ValueError(f'Unrecognized note: {n!r}')
        letter, acc = m.groups()
        return (Cleaning.BASE[letter.upper()] + acc.count('#') - acc.count('b')) % 12

    def parse_key(self, s):
        note_part, mode = self.normalize(s).rsplit(' ', 1)
        mode = mode.lower()
        if mode not in ('major', 'minor'):
            raise ValueError(f'Unrecognized mode in {s!r}')
        pitches = {self.parse_spelling(n) for n in note_part.split('/')}
        if len(pitches) > 1:
            raise ValueError(f'Inconsistent spellings in {s!r}: {pitches}')
        return pitches.pop(), int(mode == 'major')

    def encode(self, s):
        pitch, mode = self.parse_key(s)
        return f"{pitch}-{mode}"

    def clean(self):
        df = pd.read_csv(self.file)
        df = df.drop(columns=['#','Added At'], errors='ignore')

        # Convert Duration, Explicit and Key to correct values
        df['Duration'] = pd.to_timedelta('00:' + df['Duration']).dt.total_seconds()

        df['Explicit'] = df['Explicit'].str.lower().map({'yes': 1, 'no': 0})

        df['Key'] = df["Key"].apply(self.encode)
        
        # Save file to clean version
        df.to_csv('clean_'+ self.file, index=False)

class SQLiteImport:
    def __init__(self, database_name: str, data_name: str):
        self.database = database_name
        self.data = data_name

    def start(self):
        conn = sqlite3.connect(self.database)
        conn.execute("PRAGMA foreign_keys = ON")

        with open(self.data, newline="", encoding="utf-8") as f:
            # for r in csv.DictReader(f):
            #     cur = conn.execute(
            # "INSERT OR IGNORE INTO music_albums (title, release_date) VALUES (?, ?)",
            # (r["Album"], r["Album Date"]))
            # album_id = conn.execute(
            # "SELECT id FROM music_albums WHERE title=? AND release_date IS ?",
            # (r["Album"], r["Album Date"])).fetchone()[0]
            for r in csv.DictReader(f):
                conn.execute("""INSERT INTO music_songs
                (title, album_id, spotify_track_id, isrc, bpm, camelot, musical_key,
                time_signature, duration_s, loudness_db, energy, danceability,
                acousticness, instrumentalness, valence, speechiness, liveness,
                popularity, explicit)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (r["Song"], r["Spotify Track Id"], r["ISRC"],
                float(r["BPM"]), r["Camelot"], str(r["Key"]), int(r["Time Signature"]),
                int(round(float(r["Duration"]))), float(r["Loud (Db)"]),
                float(r["Energy"]), float(r["Dance"]), float(r["Acoustic"]),
                float(r["Instrumental"]), float(r["Valence"]), float(r["Speech"]),
                float(r["Live"]), int(r["Popularity"]),
                bool(int(r["Explicit"]))))
        conn.commit()

class PostgreSQLImport:
    def __init__(self):
        pass


if __name__ == '__main__':
    # cleaner = Cleaning('merged.csv')
    # cleaner.clean()
    importer = SQLiteImport("Test.db", "clean_merged.csv")
    importer.start()