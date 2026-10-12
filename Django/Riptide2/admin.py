from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

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