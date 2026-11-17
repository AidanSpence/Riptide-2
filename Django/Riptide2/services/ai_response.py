import json
import logging

from rest_framework.exceptions import ValidationError
from Riptide2.services.playlist_creator import create_playlist
from Riptide2.services.providers import get_provider
from Riptide2.services.recommendations import analyse_music_request
from Riptide2.services.spotify_client import SpotifyNotLinked, get_playlist_tracks
from Riptide2.services.system import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

MAX_CONTEXT_TRACKS = 75


def format_tracks_for_prompt(tracks: list[dict]) -> str:
    """format Spotify track metadata for the legacy direct-reference path."""
    shown = tracks[:MAX_CONTEXT_TRACKS]
    lines = []
    for index, track in enumerate(shown, 1):
        artists = track.get("artist")
        if not artists:
            artist_list = track.get("artists") or []
            artists = ", ".join(str(name) for name in artist_list if name) or "Unknown artist"
        details = [f"{index}. {track.get('name') or 'Unknown track'} - {artists}"]
        if track.get("album"):
            details.append(f"album: {track['album']}")
        if "explicit" in track:
            details.append(f"explicit: {'yes' if track.get('explicit') else 'no'}")
        if track.get("duration_ms") is not None:
            details.append(f"duration_ms: {track['duration_ms']}")
        track_id = track.get("spotify_track_id") or track.get("id")
        if track_id:
            details.append(f"id: {track_id}")
        lines.append(" | ".join(details))
    if len(tracks) > len(shown):
        lines.append(f"...and {len(tracks) - len(shown)} more tracks not shown.")
    return "\n".join(lines)


def playlist_with_message(messages: list[dict], tracks: list[dict]) -> list[dict]:
    """append Spotify reference tracks to the latest user message without mutating input."""
    block = (
        "\n\n[The user's existing Spotify playlist, for reference:]\n"
        + format_tracks_for_prompt(tracks)
    )
    copied = [dict(message) for message in messages]
    for message in reversed(copied):
        if message.get("role") == "user":
            message["content"] = f"{message.get('content', '')}{block}"
            break
    return copied


def build_chat_history(messages):
    """include saved spotify references when a chat is continued."""
    history = []
    for message in messages:
        content = message.text
        attachment = message.playlist_data or {}
        if message.sender == "user" and attachment.get("source") == "spotify":
            tracks = attachment.get("tracks") or []
            context = {"playlist": {
                "name": attachment.get("name") or "Spotify playlist",
                "track_count": attachment.get("track_count", len(tracks)),
                "tracks": tracks[:MAX_CONTEXT_TRACKS],
            }}
            content = "<context>\n" + json.dumps(context, ensure_ascii=False) + "\n</context>\n<request>\n" + content + "\n</request>"
        if content:
            history.append({"role": "user" if message.sender == "user" else "assistant", "content": content})
    return history


def generate_ai_response(messages, user, playlist_id=None, spotify_playlist_id=None):
    """generate a playlist, retrying once if the ai returns invalid data."""

    provider = get_provider()
    request_messages = list(messages)

    # retained for callers that still pass a Spotify playlist id directly.
    # The current chat API normally saves playlist context before this point.
    if spotify_playlist_id and user is not None:
        try:
            tracks = get_playlist_tracks(user, spotify_playlist_id)
        except SpotifyNotLinked:
            return {"type": "spotify_not_linked"}
        if tracks:
            request_messages = playlist_with_message(request_messages, tracks)

    for attempt in range(2):
        response = "".join(
            provider.stream(request_messages, system=SYSTEM_PROMPT)
        )

        try:
            ai_msg, clarify, question = analyse_music_request(response)
            break

        except ValidationError as error:
            logger.warning("ai response validation failed: %s", error.detail)

            # stop if the second response is also invalid
            if attempt == 1:
                raise

            # show the model its response and ask it to correct the structure
            request_messages.extend([
                {
                    "role": "assistant",
                    "content": response,
                },
                {
                    "role": "user",
                    "content": (
                        "Your previous response failed validation: "
                        + str(error.detail)
                        + "\nReturn the COMPLETE corrected JSON object using "
                        "the schema in your system instructions. "
                        "Include the full search object and all playlist fields, "
                        "including message and chat_name. "
                        "Keep the original music request and playlist references. "
                        "Return JSON only."
                    ),
                },
            ])

    if clarify:
        return {"type": "clarification", "question": question}

    playlist = create_playlist(
        ai_data=ai_msg,
        user=user,
        playlist_id=playlist_id,
    )

    return {"type": "playlist", **playlist}