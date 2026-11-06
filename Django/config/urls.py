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
    path("spotify/login/", views.spotify_login, name="spotify_login"),
    path("spotify/callback/", views.spotify_callback, name="spotify_callback"),
    path("spotify/export/", views.export, name="spotify_export"),
    # path("spotify/import/<str:playlist_id>/", views.import_playlist, name="spotify_import"),

    # chats
    path("api/chats/", api.chats),
    path("api/chats/<int:chat_id>/", api.chat_detail),
    path("api/chats/<int:chat_id>/messages/", api.chat_send_message),
]
