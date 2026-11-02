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
    clarification = ai_data.get("clarification", {})

    summarised = summarise(tracks)

    user_playlist = {
        "name": settings.get("name") or "Your playlist",
        "description": intent.get("description") or "",
        "tracks": summarised,
    }

    send_playlist = {
        "message": settings.get("message") or "",
        "chat_name" : settings.get("chat_name") or "",
        "name": settings.get("name") or "Your playlist",
        "tracks": summarised,
    }

    if not summarised or user is None:
        return send_playlist # guest users get the playlist but nothing is saved

    saved = save_playlist_for_user(user, user_playlist, playlist_id=playlist_id)
    user_playlist["playlist_id"] = saved.id
    user_playlist["saved"] = True

    return send_playlist

