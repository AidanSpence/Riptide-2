from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from Riptide2 import api, views

urlpatterns = [
    path("admin/", admin.site.urls),

    # authentication
    path("api/signup/", api.signup),
    path("api/login/", TokenObtainPairView.as_view()),  # username and password
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", api.me),

    # integrations and exports
    path("api/export/", views.export),
    path("api/spotify-login/", views.spotify_login),

    # chats
    path("api/chats/", api.chats),
    path("api/chats/<int:chat_id>/", api.chat_detail),
    path("api/chats/<int:chat_id>/messages/", api.chat_send_message),
]
