import requests

def get_playlist_tracks(playlist_id, access_token):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/items"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"limit": 50}
    
    all_tracks = []
    
    while url:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            print(f"Error: {response.status_code}", response.json())
            break
            
        data = response.json()
        
        for item in data.get('items', []):
            track = item.get('track')
            if track:  # Track can sometimes be null if unavailable
                track_info = {
                    "name": track.get("name"),
                    "artist": ", ".join([artist["name"] for artist in track.get("artists", [])]),
                    "album": track.get("album", {}).get("name"),
                    "explicit": track.get("explicit"),
                    "uri": track.get("uri")
                }
                all_tracks.append(track_info)
        
        # Move to next page if available, else terminates loop
        url = data.get('next') 
        params = None  # query parameters are already baked into the 'next' URL
        
    return all_tracks