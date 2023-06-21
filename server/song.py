import re
from spotipy.oauth2 import SpotifyClientCredentials
from secret import spotify_client_id, spotify_client_secret, genius_api_key
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

    return song_dict

def search_song_single(query):
    song_single = sp.search(query, 1, type="track")['tracks']['items']

    title = song_single[0]['name']
    id = song_single[0]['id']
    artist = song_single[0]["artists"][0]['name']
    icon_url = song_single[0]["album"]['images'][0]['url']

    return {"title":title, "artist": artist, "icon": icon_url, "id": id}

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

    def get_dict(self):
        song_dict = {'title': self.title, 
                'artist': self.artist,
                'album': self.album,
                'cover': self.cover,
                'duration': self.duration,
                'duration_m': self.duration_minutes,
                'duration_s': self.duration_seconds,
                'lyrics': self.lyrics}  
        
        return song_dict
