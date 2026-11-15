from Riptide2.services.candidate_search import retrieve_candidates
from Riptide2.services.playlist_builder import build_playlist
from Riptide2.services.playlist_saver import save_playlist_for_user

def summarise(playlist):
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "artists": ", ".join(s.get("artists") or []),
            "duration_s": s.get("duration_s"),
            "spotify_track_id": s["spotify_track_id"],
        }
        for s in playlist
    ]

def create_playlist(ai_data, user=None, playlist_id=None):
    candidates = retrieve_candidates(ai_data)
    tracks = build_playlist(candidates=candidates, ai_data=ai_data)

    settings = ai_data.get("playlist", {})
    intent = ai_data.get("intent", {})

    summarised = summarise(tracks)

    playlist = {
        "message": settings.get("message") or "",
        "chat_name": settings.get("chat_name") or "",
        "name": settings.get("name") or "",
        "description": intent.get("description") or "",
        "tracks": summarise(tracks),
    }

    if not summarised or user is None:
        return playlist # guest users get the playlist but nothing is saved

    to_save = {k: playlist[k] for k in ("name", "description", "tracks")}
    saved = save_playlist_for_user(user, to_save, playlist_id=playlist_id)

    playlist["playlist_id"] = saved.id
    playlist["saved"] = True

    return playlist

