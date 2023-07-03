from flask import Blueprint
from gpt_explain import gpt_explain, gpt_emotion, gpt_explain_no_emotions
from hume_outputs import top_five_song, top_five_stanza
from song import search_song_single
from song import Song, search_song
import json

main = Blueprint("main", __name__)

## ENDPOINTS ##
@main.route('/')
def hello():
    return '<h1>Moodfy Server</h1>'

@main.route('/song/<song_id>')
def get_song(song_id):
    return json.dumps(Song(song_id).get_dict())

@main.route('/search/<query>')
def get_search(query):
    return json.dumps(search_song(query))

@main.route('/topfive/<song_id>')
def top_five_emotions_whole(song_id):
    song = Song(song_id)
    return json.dumps(top_five_song(song.lyrics))

@main.route('/topfivestanza/<song_id>')
def top_five_emotions_stanza(song_id):
    song = Song(song_id)
    return json.dumps(top_five_stanza(song.lyrics))

@main.route('/gptexplain/<song_id>')
def gpt_explanation(song_id):
    song = Song(song_id)
    # gpt_explanation = gpt_explain(song.lyrics)
    gpt_explanation = gpt_explain_no_emotions(song.lyrics, song.title, song.artist)
    return json.dumps({"items": gpt_explanation})


@main.route('/gptrecsong/<mood>')
def gpt_recsong(mood):
    gpt_rec = gpt_emotion(mood)
    print(gpt_rec)
    return json.dumps(search_song_single(gpt_rec))

@main.route('/loadallinfo/<song_id>')
def loadallinfo(song_id):
    song = Song(song_id)
    print(f"Song Found - {song.title}")

    # song in dictionary representation
    song_rep = [song.get_dict()]

    # list of explanations
    gpt_explanation = gpt_explain(song.lyrics)

    # dictionary with list of moods and list of explanations for whole song
    top_five = top_five_song(song.lyrics)

    # list of dictionaries with list of moods and list of explanations
    # top_five_verse = top_five_stanza(song.lyrics)

    return json.dumps({"song": song_rep, "gpt_explanation": gpt_explanation, 
                       "top_five_whole": top_five}) 

# "top_five_verse": top_five_verse}