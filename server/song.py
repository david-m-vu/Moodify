import re
from secret import genius_api_key
from spotipy.oauth2 import SpotifyClientCredentials
from secret import spotify_client_id, spotify_client_secret
import spotipy as sp
from lyricsgenius import Genius
import json

sp = sp.Spotify(auth_manager=SpotifyClientCredentials(client_id=spotify_client_id, 
                                                      client_secret=spotify_client_secret))

gs = Genius(genius_api_key)

def search_song(query):
    song_list = sp.search(query, 10, type="track")['tracks']['items']

    song_dict = {"items":[]}
    
    print(len(song_list))
    for i in range(len(song_list)):
        title = song_list[i]['name']
        id = song_list[i]['id']
        artist = song_list[i]["artists"][0]['name']
        icon_url = song_list[i]["album"]['images'][0]['url']

        song_dict["items"].append({"title":title, "artist": artist, "icon": icon_url, "id": id})

    return json.dumps(song_dict)

class Song:
    title = "TITLE"
    artist = "ARTIST"
    album = "ALBUM NAME"
    cover = "COVER URL"
    duration = "00:00"
    lyrics = ""

    def __init__(self, id):
        self.track_item = sp.track(id)

        self.title = self.track_item['name']
        self.artist = self.track_item["artists"][0]['name']
        self.album = self.track_item["album"]['name']
        self.cover = self.track_item["album"]['images'][0]['url']
        self.duration_ms = self.track_item['duration_ms']

        self.duration_seconds_total = self.duration_ms // 1000
        self.duration_minutes = self.duration_seconds_total // 60
        self.duration_seconds = self.duration_seconds_total % 60

        if self.duration_seconds < 10:
            self.duration = f"{self.duration_minutes}:0{self.duration_seconds}"
        else:
            self.duration = f"{self.duration_minutes}:{self.duration_seconds}"

        self.gs_song = gs.search_song(self.title, self.artist)
        self.lyrics = self.gs_song.lyrics
        self.lyrics = '\n'.join(self.lyrics.split('\n')[1:-1])

    def get_json(self):
        song_dict = {'title': self.title, 
                'artist': self.artist,
                'album': self.album,
                'cover': self.cover,
                'duration': self.duration,
                'duration_m': self.duration_minutes,
                'duration_s': self.duration_seconds,
                'lyrics': self.lyrics}  
        
        return json.dumps(song_dict)

# example_parse = remove_subtitles(remove_spaces(Song("2LBqCSwhJGcFQeTHMVGwy3").lyrics))
# print(example_parse)
# print(parse_text(example_parse))
    