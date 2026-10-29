from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password
from .models import User
import json
from django.contrib.auth import get_user_model
from django.http import JsonResponse

User = get_user_model()

def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = json.loads(request.body)

    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    # Check required fields
    if not username or not password or not confirm_password:
        return JsonResponse({"error": "Missing fields"}, status=400)

    # Check passwords match
    if password != confirm_password:
        return JsonResponse({"error": "Passwords do not match"}, status=400)

    # Check username availability
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=409)

    # Create account (password is automatically hashed)
    try:
        User.objects.create_user(username=username, password=password)
    except Exception:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": "Account creation failed"}, status=500)

    return JsonResponse({"message": "Account created"}, status=201)



class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password")
        read_only_fields = ("id",)

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

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