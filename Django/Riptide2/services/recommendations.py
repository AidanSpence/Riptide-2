import json
from rest_framework.exceptions import ValidationError
from Riptide2.services.serializers import RecommendationRequestSerializer
from Riptide2.services.ai_response import generate_ai_response

def analyse_music_request(messages):
    response = generate_ai_response(messages)

    try:
        ai_data = json.loads(response)
    except json.JSONDecodeError as e:
        raise ValidationError({
            "ai_response": "invalid JSON response"
        }) from e

    serializer = RecommendationRequestSerializer(data=ai_data)

    if not serializer.is_valid():
        raise ValidationError({
            "ai_response": "AI response failed validation.",
            "details": serializer.errors,
        })

    return serializer.validated_data
