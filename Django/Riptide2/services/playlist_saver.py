from django.db import transaction
from ..models import Playlist, PlaylistSong, Song

@transaction.atomic
def save_playlist_for_user(user, data, playlist_id=None):
    song_ids = list(dict.fromkeys(t["id"] for t in data["tracks"]))
    found = set(Song.objects.filter(id__in=song_ids).values_list("id", flat=True))
    missing = [i for i in song_ids if i not in found]
    if missing:
        raise ValueError(f"Unknown song ids: {missing}")

    if playlist_id:
        playlist = Playlist.objects.get(id=playlist_id, user=user)  # user check prevents editing others' playlists
        playlist.name = data.get("title") or playlist.name
        playlist.save(update_fields=["name"])
        playlist.playlistsong_set.all().delete()
    else:
        playlist = Playlist.objects.create(user=user, name=data.get("title") or "Untitled Playlist")

    PlaylistSong.objects.bulk_create(
        PlaylistSong(playlist=playlist, song_id=sid, position=pos)
        for pos, sid in enumerate(song_ids)
    )
    return playlist