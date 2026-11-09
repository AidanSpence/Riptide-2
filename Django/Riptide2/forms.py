"""account forms for django admin."""

from django.contrib.auth.forms import UserCreationForm

from .models import User


class SignupForm(UserCreationForm):
    """create a user with a username."""

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username",)
