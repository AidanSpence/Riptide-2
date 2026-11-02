from Django.Riptide2.services.providers import get_provider
from Django.Riptide2.services.system import SYSTEM_PROMPT
from Riptide2.services.recommendations import analyse_music_request
from Riptide2.services.playlist_creator import create_playlist


def generate_ai_response(messages, user, playlist_id=None):
    provider = get_provider()

    response = "".join(
        provider.stream(messages, system=SYSTEM_PROMPT)
    )

    ai_msg, clarify, question = analyse_music_request(response)

    if clarify:
        print(question)
    else:
        print(create_playlist(ai_data=ai_msg, user=user, playlist_id=None))