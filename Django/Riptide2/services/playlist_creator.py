from Riptide2.services.candidate_search import retrieve_candidates
from Riptide2.services.playlist_builder import build_playlist

def create_playlist(ai_data):
    candidates = retrieve_candidates(ai_data)

    playlist = build_playlist(
        candidates=candidates,
        ai_data=ai_data,
    )
    print(playlist)
    return playlist