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

    @admin.display(description="artists")
    def artist_names(self, obj):
        return ", ".join(a.name for a in obj.artists.all())

    # music data is managed by postgres
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(User)
class UserAdmin(UserAdmin):
    ordering = ("username",)
    list_display = ("username", "is_staff", "is_active")
    search_fields = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Profile", {"fields": ("email", "avatar_url")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser",
                                    "groups", "user_permissions")}),
        ("Dates", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2"),
        }),
    )