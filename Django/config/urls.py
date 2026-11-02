from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Riptide2 import views, chat_api
from django.http import JsonResponse

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/signup/", views.signup),
    path("api/login/", TokenObtainPairView.as_view()),   # body: {"email", "password"}
    path("api/chat/", views.chat),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", views.me),
    path("api/export", views.export),
    path("api/spotify-login", views.spotify_login),
    path("api/chats/", chat_api.chats),
    path("api/chats/<int:chat_id>/", chat_api.chat_detail),
    path("api/chats/<int:chat_id>/messages/", chat_api.chat_send_message),
]


# change so it works with django ninja
