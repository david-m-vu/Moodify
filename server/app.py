from flask import Flask
from gpt_explain import gpt_explain, gpt_emotion
from hume_outputs import top_five_song, top_five_stanza
from song import search_song_single
from song import Song, search_song
import json
from flask import Flask 
<<<<<<< Updated upstream
from hume import HumeStreamClient
from hume.models.config import LanguageConfig
import secret

app = Flask(__name__)

client_access_token = secret.genius_api_key

## GPT ##
# Load your API key from an environment variable or secret management service
openai.organization = secret.organization_id
openai.api_key = secret.open_ai_key
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

def load_config():
    with open('./config.json', 'r') as f:
        config = json.load(f)
    return config

config = load_config()

## HUME ##
humeKey = config["hume_key"]

EMOTIONS = np.array([
    "admiring", "adoring", "appreciative", "amused", "angry", "anxious", "awestruck", "uncomfortable", "bored", "calm",
    "focused", "contemplative", "confused", "contemptuous", "content", "hungry", "determined", "disappointed",
    "disgusted", "distressed", "doubtful", "euphoric", "embarrassed", "disturbed", "entranced", "envious", "excited",
    "fearful", "guilty", "horrified", "interested", "happy", "enamored", "nostalgic", "pained", "proud", "inspired",
    "relieved", "smitten", "sad", "satisfied", "desirous", "ashamed", "negatively surprised", "positively surprised",
    "sympathetic", "tired", "triumphant"
])

def get_adjective(score):
    if 0.26 <= score < 0.35:
        return "slightly"
    elif 0.35 <= score < 0.44:
        return "somewhat"
    elif 0.44 <= score < 0.53:
        return "moderately"
    elif 0.53 <= score < 0.62:
        return "quite"
    elif 0.62 <= score < 0.71:
        return "very"
    elif 0.71 <= score <= 3:
        return "extremely"
    else:
        return "" 
    
async def get_top_five(whole_lyrics):
    ans = []
    
    def process_section(section):
        emotion_predictions = []
        emo_dict = {}
        for frame_dict in section:
            emo_dict[frame_dict["name"]] = frame_dict["score"]
        
        test = sorted(emo_dict.items(), key = lambda item : -item[1])

        for i in range(5):
            k = test[i][0]
            top_five[k] = test[i][1]

    client = HumeStreamClient(humeKey)
    config = LanguageConfig()
    async with client.connect([config]) as socket:
        for sample in [whole_lyrics]:
            result = await socket.send_text(sample)
            emotions = result["language"]["predictions"][0]["emotions"]
            process_section(emotions)

async def stringify_lines(lyrics):
    print(lyrics)
    ans = []
    global processed 

    def process_section(section):
        emotion_predictions = []
        emo_dict = {}
        for frame_dict in section:
            emo_dict[frame_dict["name"]] = frame_dict["score"]

        emo_frame = sorted(emo_dict.items())
        emo_frame = np.array([x[1] for x in emo_frame])
        emotion_predictions.append(emo_frame)
        
        # Assuming 'emotion_predictions' is a 2D array
        mean_predictions = np.array(emotion_predictions).mean(axis=0)
        # Get the index of the highest value
        top_index = np.argmax(mean_predictions)

        # # Add adjectives to the top emotion based on the prediction score
        top_emotion_adjective = f"{get_adjective(mean_predictions[top_index])} {EMOTIONS[top_index]}"
        
        return top_emotion_adjective

    client = HumeStreamClient(humeKey)
    config = LanguageConfig()
    async with client.connect([config]) as socket:
        for sample in lyrics:
            result = await socket.send_text(sample)
            emotions = result["language"]["predictions"][0]["emotions"]
            a = process_section(emotions)
            ans.append(a)

    processed = ans

top_five = {} # contains top five emotions of a given song in emotion: score value pair 
processed = [] # contains the stringified description of the emotion of every lyric line in a given song 

# Outputs GPT Explanations
def gpt_explain(lyrics):
    lyrics = parse_text_verse(lyrics.strip("'"))
    asyncio.run(stringify_lines(lyrics)) # pre floods processed so we can directly put it into gpt prompt

    gpt_explanation = []

    for stanza in lyrics:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a song analyzer."},
                {"role": "user", "content": "Analze the following stanza: " + stanza}
            ]
        )

        message_content = response["choices"][0]["message"]["content"]
        gpt_explanation.append(message_content)

    return gpt_explanation

def gpt_emotion(mood):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a song finder."},
            {"role": "user", "content": "Find ONLY 1 song that matches the mood of " + mood 
             + "Send the song in this format 'title - artist' and only send this"}
        ]
    )

    message_content = response["choices"][0]["message"]["content"]
    return message_content

=======
from flask_cors import CORS  

app = Flask(__name__) 
CORS(app)

>>>>>>> Stashed changes
## ENDPOINTS ##
@app.route('/')
def hello():
    return '<h1>Moodfy Server</h1>'

@app.route('/song/<song_id>')
def get_song(song_id):
    return json.dumps(Song(song_id).get_dict())

@app.route('/search/<query>')
def get_search(query):
    return json.dumps(search_song(query))

@app.route('/topfive/<song_id>')
<<<<<<< Updated upstream
def top_five_emotions(song_id):
    asyncio.run(get_top_five(Song(song_id).lyrics))
    top_five_array = [(k, v) for k, v in top_five.items()]
    top_five_array = sorted(top_five, key=lambda x: x[1])
    return top_five_array
=======
def top_five_emotions_whole(song_id):
    song = Song(song_id)
    return json.dumps(top_five_song(song.lyrics))

@app.route('/topfivestanza/<song_id>')
def top_five_emotions_stanza(song_id):
    song = Song(song_id)
    return json.dumps(top_five_stanza(song.lyrics))
>>>>>>> Stashed changes

@app.route('/gptexplain/<song_id>')
def gpt_explanation(song_id):
    song = Song(song_id)
    gpt_explanation = gpt_explain(song.lyrics)
    return json.dumps({"items": gpt_explanation})

@app.route('/gptrecsong/<mood>')
def gpt_recsong(mood):
    gpt_rec = gpt_emotion(mood)
    print(gpt_rec)
    return json.dumps(search_song_single(gpt_rec))

@app.route('/loadallinfo/<song_id>')
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
    top_five_verse = top_five_stanza(song.lyrics)

    return json.dumps({"song": song_rep, "gpt_explanation": gpt_explanation, 
                       "top_five_whole": top_five, "top_five_verse": top_five_verse})