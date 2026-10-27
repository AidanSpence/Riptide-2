from __future__ import annotations
import math
import random
from typing import Any

NORMALISED_FEATURES = {
    "energy",
    "danceability",
    "acousticness",
    "instrumentalness",
    "valence",
    "speechiness",
    "liveness",
}

RAW_FEATURES = {"bpm", "loudness_db"}


def to_db_scale(feature: str, value: float) -> float:
    """convert AI values to database style"""
    if feature in NORMALISED_FEATURES:
        return value * 100
    return value


def clamp(value: float, low: float = 0.0,
           high: float = 1.0) -> float:
    """Ensures all values are in 0 to 1 range"""
    return max(low, min(high, value))


def number(value: Any) -> float | None:
    """Safely convert a value to a finite float."""
    if value is None or isinstance(value, bool):
        return None

    try:
        result = float(value)
    except (TypeError, ValueError):
        return None

    return result if math.isfinite(result) else None


def feature_score(song: dict, feature: str, preference: dict) -> float | None:
    """
    Score one feature of a song from 0 to 1 to determine closeness. 
    Returns None if the song or preference lacks usable data.
    """
    actual = number(song.get(feature))
    target = number(preference.get("target"))

    if actual is None or target is None:
        return None

    target = to_db_scale(feature, target)

    minimum = number(preference.get("min"))
    maximum = number(preference.get("max"))

    if minimum is not None:
        minimum = to_db_scale(feature, minimum)

    if maximum is not None:
        maximum = to_db_scale(feature, maximum)

    # Ensures values are inside of AI range
    if minimum is not None and actual < minimum:
        return 0.0

    if maximum is not None and actual > maximum:
        return 0.0

    if minimum is not None and maximum is not None:
        tolerance = max((maximum-minimum)/ 2, 1e-9)
    elif minimum is not None:
        tolerance = max(abs(target-minimum), abs(target) * 0.1, 1.0)
    elif maximum is not None:
        tolerance = max(abs(maximum-target), abs(target) * 0.1, 1.0)
    else:
        # default if both min and max weights missing
        tolerance = max(abs(target) * 0.2, 1.0)

    return clamp(1.0 - abs(actual-target) / tolerance)

def song_feature_score(song: dict, audio_features: dict) -> float | None:
    """
    combine all the feature scores using Ai weights
    to determine full song closeness
    """
    weighted_total = 0.0
    total_weight = 0.0

    for feature, preference in audio_features.items():
        if feature not in NORMALISED_FEATURES | RAW_FEATURES:
            continue

        if not isinstance(preference, dict):
            continue

        score = feature_score(song, feature, preference)

        if score is None:
            continue

        weight = number(preference.get("weight"))
        if weight is None:
            weight = 1.0

        weight = max(weight, 0.0)

        if weight == 0:
            continue

        weighted_total += score * weight
        total_weight += weight

    # If no usable features exist, returns None
    if total_weight == 0:
        return None

    return weighted_total / total_weight

def similarity_score(song: dict) -> float | None:
    """Convert pgvector cosine distance into a 0-1 similarity score"""
    distance = number(song.get("distance"))

    if distance is None:
        return None

    # flips 0 cosine distance into 1 similarity as shorter distance means closer value
    return clamp(1.0 - distance)

def func_popularity_score(song: dict) -> float | None:
    """Convert database pop (0-100) to 0-1 score"""
    popularity = number(song.get("popularity"))

    if popularity is None:
        return None

    return clamp(popularity / 100)

def normalise_names(values: Any) -> set[str]:
    """Normalise artist or genre names and removes duplicates for comparison"""
    if not values:
        return set()

    if isinstance(values, str):
        values = [values]

    result = set()

    for value in values:
        if isinstance(value, str) and value.strip():
            result.add(value.strip().casefold())

    return result

def song_artists(song: dict) -> set[str]:
    return normalise_names(song.get("artists"))

def song_genres(song: dict) -> set[str]:
    return normalise_names(song.get("genres"))


def matches_hard_constraints(song: dict, constraints: dict) -> bool:
    """apply checks before selection"""

    excluded_artists = normalise_names(
        constraints.get("excluded_artists", [])
    )
    if song_artists(song) & excluded_artists:
        return False

    excluded_genres = normalise_names(
        constraints.get("excluded_genres", [])
    )
    if song_genres(song) & excluded_genres:
        return False

    required_genres = normalise_names(
        constraints.get("required_genres", [])
    )
    if required_genres and not (song_genres(song) & required_genres):
        return False

    return True

def discovery_weight(playlist_settings: dict) -> float:
    """Interpret discovery as a 0-1 preference, defaults to moderate."""
    value = playlist_settings.get("discovery", 0.3)

    if isinstance(value, dict):
        value = value.get("level", 0.3)

    value = number(value)
    return clamp(value if value is not None else 0.3)

def score_song(song: dict, audio_features: dict, playlist_settings: dict) -> float:
    """Calculate a combined match score for a possible song"""

    parts = []

    feature_score = song_feature_score(song, audio_features)
    if feature_score is not None:
        parts.append((feature_score, 0.65))

    similarity = similarity_score(song)
    if similarity is not None:
        parts.append((similarity, 0.35))

    if parts:
        total_weight = sum(weight for _, weight in parts)
        match_score = sum(score * weight for score, weight in parts) / total_weight
    else:
        match_score = 0.5

    # Familiarity vs discovery: lower popularity is favoured as discovery increases
    popularity = func_popularity_score(song)
    if popularity is not None:
        discovery = discovery_weight(playlist_settings)
        popularity_score = (
            popularity * (1.0 - discovery)
            + (1.0 - popularity) * discovery
        )
        match_score = 0.85 * match_score + 0.15 * popularity_score

    return match_score

def energy_progression(playlist_settings: dict) -> str:
    value = playlist_settings.get("energy_progression", "none")

    if isinstance(value, dict):
        value = value.get("type", "none")

    if not isinstance(value, str):
        return "none"

    value = value.casefold().replace("-", "_").replace(" ", "_")

    aliases = {
        "build": "ascending",
        "build_up": "ascending",
        "increase": "ascending",
        "wind_down": "descending",
        "decrease": "descending",
        "random": "none",
        "flat": "none",
    }

    value = aliases.get(value, value)

    if value in {"ascending", "descending", "none"}:
        return value

    return "none"

def build_playlist(candidates: list[dict], ai_data: dict, *, seed: int | None = None) -> list[dict]:
    """
    Build a playlist from database candidates and validated AI JSON.
    Returns song dictionaries, ordered as the final playlist.
    """
    search = ai_data.get("search", {})
    constraints = ai_data.get("constraints", {})
    settings = ai_data.get("playlist", {})

    track_count = settings.get("track_count", 30)
    if isinstance(track_count, bool) or not isinstance(track_count, int):
        track_count = 30
    track_count = max(1, min(track_count, 100)) # ensures number is greater than 1 but less than 100

    artist_limit = settings.get("artist_repetition_limit", 5)
    if isinstance(artist_limit, bool) or not isinstance(artist_limit, int):
        artist_limit = 5
    artist_limit = max(1, artist_limit) # ensures number is greater than 1

    audio_features = search.get("audio_features", {})

    rng = random.Random(seed)
    scored_candidates = []

    seen_ids = set()

    for song in candidates:
        # removes any songs blocked by rules
        if not matches_hard_constraints(song, constraints):
            continue

        song_id = song.get("id")
        if song_id is not None:
            if song_id in seen_ids:
                continue
            seen_ids.add(song_id)

        score = score_song(song, audio_features, settings)

        # ranking bonuses
        if preferred_genres and genres & preferred_genres:
            score += 0.10
        if included_artists and artists & included_artists:
            score += 0.15
        
        scored_candidates.append((score, rng.random(), song))

        # Apply genre preferences as 
    preferred_genres = normalise_names(search.get("genres", []))
    included_artists = normalise_names(search.get("include_artists", []))

    
    # Highest scoring candidates first, seeded randomness breaks any ties
    scored_candidates.sort(key=lambda item: (item[0], item[1]), reverse=True)

    selected = []
    artist_counts = {}

    for _, _, song in scored_candidates:
        if len(selected) >= track_count:
            break

        artists = song_artists(song)

        if any(artist_counts.get(artist, 0) >= artist_limit
                for artist in artists):
            continue

        selected.append(song)

        for artist in artists:
            artist_counts[artist] = artist_counts.get(artist, 0) + 1

        progression = energy_progression(settings)

        if progression in {"ascending", "descending"}:
            selected.sort(key=lambda song: (
                number(song.get("energy"))
                if number(song.get("energy")) is not None
                else -1
            ),
            reverse=(progression == "descending"),)

        return selected