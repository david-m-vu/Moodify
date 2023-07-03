from hume import HumeStreamClient
from hume.models.config import LanguageConfig
import asyncio
from dotenv import load_dotenv
import os
from song import Song
from lyric_processing import parse_text_verse_nosubtitles, remove_subtitles
from unidecode import unidecode # used to convert unicode to valid ascii

load_dotenv()

humeClient = HumeStreamClient(os.environ.get("hume_key"))

# DO THIS AT ENDPOINT REQUEST
# song = Song("35iCSlFxyiawRBUOtQAkeT")
##############################

EMOTIONS = { 
    "Admiration": "admiring", "Adoration": "adoring", "Aesthetic Appreciation": "appreciative", 
    "Amusement": "amused", "Anger": "angry", "Anxiety": "anxious", "Awe": "awestruck", 
    "Awkwardness": "awkward", "Boredom": "bored", "Calmness": "calm", "Concentration": "focused", 
    "Contemplation": "contemplative", "Confusion": "confused", "Contempt": "contemptuous", 
    "Contentment": "content", "Craving": "hungry", "Desire": "desirous", "Determination": "determined",
    "Disappointment": "disappointed", "Disapproval": "disapproving", "Disgust": "disgusted", 
    "Distress": "distressed", "Doubt": "doubtful", "Ecstacy":"ecstatic", "Embarrassment":"embarrassed",
    "Empathic Pain":"empathetically painful", "Enthusiasm": "Enthusiastic", "Entrancement":"entranced", 
    "Envy": "envious", "Excitement": "excited", "Fear": "fearful", "Gratitude":"grateful", 
    "Guilt": "guilty", "Horror": "horrified", "Interest": "interested", "Joy": "happy", 
    "Love": "loving", "Nostalgia": "nostalgic", "Pain": "pained", "Pride": "proud", "Realization": "awakened",
    "Relief": "relieved", "Romance": "romantic", "Sadness": "sad", "Satisfaction": "satisfied", 
    "Satisfaction": "satisfied", "Shame": "ashamed", "Surprise (negative)": "negatively surprised", 
    "Surprise (positive)": "positively surprised", "Sympathy": "sympathetic", 
    "Tiredness": "tired", "Triumph": "triumphant", "Annoyance": "annoyed", "Sarcasm": "sarcastic"
}

samples = [
    "Mary had a little lamb,",
    "Its fleece was white as snow."
    "Everywhere the child went,"
    "The little lamb was sure to go."
]

# Submit lyrics an array (multiple elements if analyze line by line)
# Returns list of top 5 emotions
async def top_five_async(lyrics_array):
    config = LanguageConfig()

    async with humeClient.connect([config]) as socket:
        items = []
        
        for lyrics in lyrics_array:
            # print(unidecode(lyrics)[:1800])
            # hume ai cant take too many characters
            result = await socket.send_text(unidecode(lyrics)[:1800])
            # print(result["language"]["predictions"][0])
            # print(len(result["language"]["predictions"]))
            emotions = result["language"]["predictions"][0]["emotions"]
            emotions_sort = sorted(emotions, key=lambda x: -x['score'])
            emotions_sort = emotions_sort[0:5]
            # print(emotions_sort)
            emotions_sort_list = [x['name'] for x in emotions_sort]
            scores = [x['score'] for x in emotions_sort]
            emoscore_dict = {"emotions": emotions_sort_list, "scores": scores}
            items.append(emoscore_dict)

        return items

# Returns a list of moods for each stanza in a song
def top_five_stanza(lyrics):
    lyrics = parse_text_verse_nosubtitles(lyrics)
    print("Lyrics successfully parsed (stanzas)")

    return asyncio.run(top_five_async(lyrics))

# Returns a list of moods for the entire song
def top_five_song(lyrics):
    lyrics = [remove_subtitles(lyrics)]
    print("Lyrics successfully parsed (whole song)")

    return asyncio.run(top_five_async(lyrics))

# Returns a list of stringified moods for gpt prompt
def stringify(lyrics):
    scores_stringified = []
    stanza_moods = top_five_stanza(lyrics)

    for stanza_mood in stanza_moods:
        score_string = ""
        for i in range(4):
            score_string = score_string + f"{get_adjective(stanza_mood['scores'][i])} {EMOTIONS[stanza_mood['emotions'][i]]}, "
        
        final_emo = f"and {get_adjective(stanza_mood['scores'][4])} {EMOTIONS[stanza_mood['emotions'][4]]}"
        scores_stringified.append("This stanza is " + score_string + final_emo)

    return scores_stringified
    
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





    