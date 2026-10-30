import json
import spotipy as sp
from spotipy.oauth2 import SpotifyOAuth
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.password_validation import validate_password
from .providers import get_provider
from Riptide2.system import SYSTEM_PROMPT
from .models import User


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password")

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, data):
        return User.objects.create_user(**data)


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    s = SignupSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    s.save()
    return Response(s.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def me(request):
    u = request.user
    return Response({"id": str(u.id), "email": u.email,
                     "username": u.username})

@api_view(["GET"])
def export(request):
    user_playlist = request.user_playlist
    track_uris = []
    track_ids = [t["spotify_track_id"] for t in user_playlist["tracks"]]
    for id in track_ids:
        track_uris.append("spotify:track:" + id)
    new_playlist = sp.user_playlist_create(
        user=sp.current_user()["id"], 
        name=user_playlist["title"],
        public=False,
        description=user_playlist["message"]
        )
    playlist_id = new_playlist["id"]
    sp.playlist_add_items(playlist_id=playlist_id, items=track_uris)




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

