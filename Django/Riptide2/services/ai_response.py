from Django.Riptide2.services.providers import get_provider
from Django.Riptide2.services.system import SYSTEM_PROMPT


def generate_ai_response(messages):
    provider = get_provider()

    response = "".join(
        provider.stream(messages, system=SYSTEM_PROMPT)
    )

    return response