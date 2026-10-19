import json
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .providers import get_provider

SYSTEM_PROMPT = "You are music bot"

@csrf_exempt
def chat(request):
    if request.method != "POST":
        return JsonResponse({"error" : "POST only"}, status=405)
    messages = json.loads(request.body).get("messages", [])

    def gen():
        try:
            for text in get_provider().stream(messages, system=SYSTEM_PROMPT):
                yield f"data: {json.dumps({'t': text})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({"error": str(e)})}\n\n"
        yield "data: [DONE]\n\n"

    resp = StreamingHttpResponse(gen(), content_type="text/event-stream")
    resp['Cache-Control'] = "no-cache"
    resp['X-Accel-Buffering'] = "no"
    return resp
