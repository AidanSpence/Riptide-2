import json
from rest_framework.exceptions import ValidationError
from Riptide2.services.serializers import RecommendationRequestSerializer


def extract_json(message):
    """Pull the JSON object out of the models reply"""
    text = message.strip()

    # strip ```json ... ``` if the model added them
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValidationError("AI reply did not contain a JSON object.")

    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        raise ValidationError(f"AI reply was not valid JSON: {e}")

def analyse_music_request(message):
    ai_data = extract_json(message)
    
    serializer = RecommendationRequestSerializer(data=ai_data)
    serializer.is_valid(raise_exception=True)

    return serializer.validated_data
