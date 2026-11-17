from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from Riptide2 import api, views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", api.health),

    # authentication
    path("api/signup/", api.signup),
    path("api/login/", TokenObtainPairView.as_view()),  # username and password
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", api.me),

    # integrations and exports
    path("spotify/login/", views.spotify_login),
    path("spotify/callback/", views.spotify_callback),
    path("api/spotify/export/<int:playlist_id>/", views.export),
    path("spotify/playlists/", views.spotify_playlists),
    path("spotify/status/", api.spotify_status),
    path("spotify/logout/", api.spotify_logout),

    # playlists
    path("api/playlists/", api.list_playlists),
    path("api/playlists/<int:playlist_id>/", api.delete_playlist),
    # chats
    path("api/chats/", api.chats),
    path("api/chats/<int:chat_id>/", api.chat_detail),
    path("api/chats/<int:chat_id>/messages/", api.chat_send_message),
]
