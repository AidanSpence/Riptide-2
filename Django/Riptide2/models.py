import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from .fields import CIEmailField, CICharField
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from pgvector.django import VectorField


class UserManager(BaseUserManager):
    """create regular and admin accounts."""
    use_in_migrations = True

    def create_user(self, username, password=None, **extra):
        user = self.model(username=username, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)

        return self.create_user(username, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    """account details and permissions."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = CIEmailField(unique=True, null=True, blank=True)
    username = CICharField(max_length=150, unique=True)
    avatar_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []
    objects = UserManager()

    class Meta:
        db_table = "users"

class Artist(models.Model):
    name = models.TextField(unique=True)

    class Meta:
        managed = False
        db_table = 'music"."artists'

    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.TextField()
    artists = models.ManyToManyField(Artist, through="SongArtist", related_name="songs")
    bpm = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    camelot = models.CharField(max_length=3, null=True)
    energy = models.FloatField(null=True)
    features = VectorField(dimensions=9, null=True, editable=False)
    duration_s = models.IntegerField(null=True)
    cluster_id = models.IntegerField(null=True)

    class Meta:
        managed = False  # postgres owns this table
        db_table = 'music"."songs'

class SongArtist(models.Model):
    song = models.OneToOneField(Song, on_delete=models.DO_NOTHING, db_column="song_id", primary_key=True)
    artist = models.ForeignKey(Artist, on_delete=models.DO_NOTHING, db_column="artist_id")
    position = models.SmallIntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'music"."song_artists'


class Playlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="playlists",       # was OneToOneField
    )
    chat = models.ForeignKey(           # optional: link to the chat that made it
        "UserChat",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="playlists",
    )
    name = models.TextField()
    description = models.TextField(blank=True, default="")
    message = models.TextField(blank=True, default="")   # the AI's interim message
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)     # changes when a refinement replaces the tracks

    songs = models.ManyToManyField(Song, through="PlaylistSong", related_name="playlists")

    class Meta:
        db_table = "playlists"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "-created_at"])]

    def __str__(self):
        return self.name


class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    position = models.IntegerField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "playlist_songs"
        ordering = ["position"]
        constraints = [
            models.UniqueConstraint(fields=["playlist", "song"], name="uniq_playlist_song"),
        ]


class LinkedAccount(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    provider = models.TextField()
    provider_user_id = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "linked_accounts"
        constraints = [
            models.UniqueConstraint(fields=["user", "provider"], name="uniq_user_provider"),
            models.UniqueConstraint(fields=["provider", "provider_user_id"], name="uniq_provider_account"),
        ]


class SpotifyAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    spotify_user_id = models.CharField(max_length=100)
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_at = models.DateTimeField()


class UserChat(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chats"
    )
    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_chats"


class ChatMessage(models.Model):
    class Sender(models.TextChoices):
        USER = "user", "User"
        SYSTEM = "system", "System"

    chat = models.ForeignKey(
        UserChat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.CharField(
        max_length=10,
        choices=Sender.choices
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_messages"
        ordering = ["created_at", "id"]