from flask import Flask
from song import Song, search_song
import secret

app = Flask(__name__)

client_access_token = secret.genius_api_key

@app.route('/')
def hello():
    return '<h1>Deez Nuts</h1>'

@app.route('/song/<song_id>')
def get_song(song_id):
    return Song(song_id).get_json()

@app.route('/search/<query>')
def get_search(query):
    return search_song(query)