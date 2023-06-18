from flask import Flask
import openai
import os
from song import Song, search_song
import secret

app = Flask(__name__)

#client_access_token = secret.genius_api_key

# Load your API key from an environment variable or secret management service
openai.organization = "org-BFTVdEg4mIp8j6GznLLJ4PTl"
openai.api_key = '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'
openai.Model.list()

def send_message(message):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt = message,
        max_tokens = 50,
        temperature = 0,
        n=1,
        stop=None,
    )


def gpt_emotion():
    mood = "happy"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a song finder."},
            {"role": "user", "content": "Find 5 songs that match the mood of " + mood}
        ]
    )
    return response

@app.route('/song/<song_id>')
def get_song(song_id):
    return Song(song_id).get_json()

@app.route('/search/<query>')
def get_search(query):
    return search_song(query)

@app.route("/")
def gpt_lyrics():
    lyrics = [ "Hold on, hold on, f*ck that F*ck that shit Hold on, I got to start this mothafuckin' record over again, wait a minute F*ck that shit Still on this mothafuckin' record Ima play this mothafucka for yall Ayy, yall get some more drinks goin on, Ill sound a whole lot better",
              "Listen Seein you got ritualistic Cleansin my soul of addiction for now Cause Im fallin apart, yeah Tension Between us just like picket fences You got issues that I wont mention for now Cause were fallin apart"      
    ]
    
    responses = []

    for stanza in lyrics:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a song analyzer."},
                {"role": "user", "content": "Analze the following stanza: " + stanza}
            ]
        )
        responses.append(response["content"])
    
    print(responses)
    return '<h1>Deez Nuts</h1>'
