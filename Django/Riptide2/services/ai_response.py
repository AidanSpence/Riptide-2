import json

from rest_framework.exceptions import ValidationError
from Riptide2.services.playlist_creator import create_playlist
from Riptide2.services.providers import get_provider
from Riptide2.services.recommendations import analyse_music_request
from Riptide2.services.system import SYSTEM_PROMPT


def build_chat_history(messages):
    """include saved spotify references when a chat is continued."""
    history = []
    for message in messages:
        content = message.text
        attachment = message.playlist_data or {}
        if message.sender == "user" and attachment.get("source") == "spotify":
            context = {"playlist": {
                "name": attachment["name"],
                "track_count": attachment["track_count"],
                "tracks": attachment["tracks"],
            }}
            content = "<context>\n" + json.dumps(context, ensure_ascii=False) + "\n</context>\n<request>\n" + content + "\n</request>"
        if content:
            history.append({"role": "user" if message.sender == "user" else "assistant", "content": content})
    return history


def generate_ai_response(messages, user, playlist_id=None, spotify_playlist_id=None):
    """generate a playlist, retrying once if the ai returns invalid data."""

    provider = get_provider()
    request_messages = list(messages)

    for attempt in range(2):
        response = "".join(
            provider.stream(request_messages, system=SYSTEM_PROMPT)
        )

        try:
            ai_msg, clarify, question = analyse_music_request(response)
            break

        except ValidationError as error:
            print("AI response validation failed:", error.detail, flush=True)

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