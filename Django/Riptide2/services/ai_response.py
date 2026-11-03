import json
from Riptide2.models import Playlist
from Riptide2.services.playlist_creator import create_playlist
from Riptide2.services.providers import get_provider
from Riptide2.services.recommendations import analyse_music_request
from Riptide2.services.spotify_client import SpotifyNotLinked, get_playlist_tracks
from Riptide2.services.system import SYSTEM_PROMPT

MAX_CONTEXT_TRACKS = 75

TRACK_FIELDS = ("spotify_track_id", "name", "artist", "album", "explicit", "duration_ms")


def format_tracks_for_prompt(tracks: list[dict]) -> str:
    """One line per track, all fields included."""
    shown = tracks[:MAX_CONTEXT_TRACKS]
    lines = [
        f"{i}. {t['name']} - {t['artist']}"
        f" | album: {t['album'] or 'unknown'}"
        f" | explicit: {'yes' if t['explicit'] else 'no'}"
        f" | duration_ms: {t['duration_ms']}"
        f" | id: {t['spotify_track_id']}"
        for i, t in enumerate(shown, 1)
    ]
    if len(tracks) > len(shown):
        lines.append(f"...and {len(tracks) - len(shown)} more tracks not shown.")
    return "\n".join(lines)


def playlist_with_message(messages: list[dict], tracks: list[dict]) -> list[dict]:
    """Return a copy of messages with the tracks appended to the latest user message."""
    block = (
        "\n\n[The user's existing Spotify playlist, for reference:]\n"
        + format_tracks_for_prompt(tracks)
    )
    messages = [dict(m) for m in messages]
    for m in reversed(messages):
        if m.get("role") == "user":
            m["content"] = f"{m['content']}{block}"
            break
    return messages


def generate_ai_response(messages, user, playlist_id=None, spotify_playlist_id=None):
    """Return a dict for the browser. `user` is None for guests (nothing is saved)."""

    if spotify_playlist_id and user is not None:
        try:
            tracks = get_playlist_tracks(user, spotify_playlist_id)
        except SpotifyNotLinked:
            return {"type": "spotify_not_linked"}
        if tracks:
            messages = playlist_with_message()

    response = "".join(get_provider().stream(messages, system=SYSTEM_PROMPT))

    ai_msg, clarify, question = analyse_music_request(response)

    if clarify:
        return {"type": "clarification", "question": question}

    playlist = create_playlist(ai_data=ai_msg, user=user, playlist_id=None)
    return {"type": "playlist", **playlist}