import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from .fields import CIEmailField, CICharField
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from pgvector.django import VectorField


class UserManager(BaseUserManager):
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
        managed = False # SQL owns this table
        db_table = 'music"."songs'

class SongArtist(models.Model):
    song = models.OneToOneField(Song, on_delete=models.DO_NOTHING, db_column="song_id", primary_key=True)
    artist = models.ForeignKey(Artist, on_delete=models.DO_NOTHING, db_column="artist_id")
    position = models.SmallIntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'music"."song_artists'


class Playlist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "playlists"


class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, db_constraint=True)
    position = models.IntegerField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "playlist_songs"
        constraints = [models.UniqueConstraint(fields=["playlist", "song"], name="uniq_playlist_song")]


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


class UserChat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.TextField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_chats"
