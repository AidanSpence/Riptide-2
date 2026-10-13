from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Song


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ("title", "bpm", "camelot", "energy", "cluster_id")
    search_fields = ("title",)
    list_per_page = 50
    show_full_result_count = False   # skips a slow COUNT(*) on ~20k rows

    # the SQL owns this table, so make it view-only
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(User)
class UserAdmin(UserAdmin):
    ordering = ("email",)
    list_display = ("email", "username", "display_name", "is_staff", "is_active")
    search_fields = ("email", "username", "display_name")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("username", "display_name", "avatar_url")}),
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