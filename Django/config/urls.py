from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Riptide2 import api, views, chat_api
from django.http import JsonResponse

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/signup/", api.signup),
    path("api/login/", TokenObtainPairView.as_view()),   # body: {"email", "password"}
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", api.me),

    path("api/chats/", chat_api.chats),
    path("api/chats/<int:chat_id>/", chat_api.chat_detail),
    path("api/chats/<int:chat_id>/messages/", chat_api.chat_send_message),
]


# change so it works with django ninja
