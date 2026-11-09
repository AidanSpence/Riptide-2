from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
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


class PlaylistSongInline(admin.TabularInline):
    model = PlaylistSong
    extra = 0
    ordering = ("position",)
    fields = ("position", "song_title", "song_artists", "song_duration")
    readonly_fields = ("position", "song_title", "song_artists", "song_duration")
    can_delete = False

    def get_queryset(self, request):
        return (
            super().get_queryset(request)
            .select_related("song")
            .prefetch_related("song__artists")
        )

    @admin.display(description="title")
    def song_title(self, obj):
        return obj.song.title

    @admin.display(description="artists")
    def song_artists(self, obj):
        return ", ".join(a.name for a in obj.song.artists.all())

    @admin.display(description="duration (s)")
    def song_duration(self, obj):
        return obj.song.duration_s

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "track_count", "created_at", "updated_at")
    list_select_related = ("user",)
    list_filter = ("created_at",)
    search_fields = ("name", "user__username", "user__email")
    raw_id_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [PlaylistSongInline]
    date_hierarchy = "created_at"
    list_per_page = 50

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_track_count=Count("playlistsong"))

    @admin.display(description="tracks", ordering="_track_count")
    def track_count(self, obj):
        return obj._track_count