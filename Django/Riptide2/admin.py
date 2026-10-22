from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Song, Playlist, PlaylistSong


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ("title", "artist_names", "duration_s", "bpm", "camelot", "energy", "cluster_id")
    search_fields = ("title", "artists__name", "duration_s")
    list_per_page = 50
    show_full_result_count = False

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("artists")

    @admin.display(description="Artists")
    def artist_names(self, obj):
        return ", ".join(a.name for a in obj.artists.all())

    # stops Django from editing as data is form postgre
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(User)
class UserAdmin(UserAdmin):
    ordering = ("email",)
    list_display = ("email", "username", "is_staff", "is_active")
    search_fields = ("email", "username")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("username", "avatar_url")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser",
                                    "groups", "user_permissions")}),
        ("Dates", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2"),
        }),
    )