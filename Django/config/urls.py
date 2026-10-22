from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Riptide2 import api, views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/signup/", api.signup),
    path("api/login/", TokenObtainPairView.as_view()),   # body: {"email", "password"}
    path("api/chat/", views.chat),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", api.me),
]


# change so it works with django ninja
