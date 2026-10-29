from Riptide2.services.candidate_search import retrieve_candidates
from Riptide2.services.playlist_builder import build_playlist

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

def create_playlist(ai_data):
    candidates = retrieve_candidates(ai_data)
    tracks = build_playlist(candidates=candidates, ai_data=ai_data)

    settings = ai_data.get("playlist", {})
    intent = ai_data.get("intent", {})

    user_playlist = {
        "title": settings.get("title") or "Your playlist",
        "message": settings.get("message") or "",
        "description": intent.get("description") or "",
        "tracks": summarise(tracks),
    }
    return user_playlist

