
import json
from rest_framework.exceptions import ValidationError
from Riptide2.services.serializers import RecommendationRequestSerializer


def extract_json(message):
    if isinstance(message, dict):
        return message

    if not isinstance(message, str):
        raise ValidationError({
            "ai_response": f"Expected string or dict, got {type(message).__name__}"
        })

    start = message.find("{")
    end = message.rfind("}") + 1

    if start == -1 or end <= start:
        raise ValidationError({
            "ai_response": "No JSON object found",
            "received": repr(message[:200]),
        })

    try:
        return json.loads(message[start:end])
    except json.JSONDecodeError as e:
        raise ValidationError({
            "ai_response": f"Invalid JSON: {e.msg} at position {e.pos}",
            "extracted": message[start:end][:300],
        }) from e


def analyse_music_request(message):
    ai_data = extract_json(message)

    serializer = RecommendationRequestSerializer(data=ai_data)
    serializer.is_valid(raise_exception=True)

    return serializer.validated_data
