import asyncio
import numpy as np 
from flask import Flask 
from hume import HumeStreamClient
from hume.models.config import LanguageConfig

app = Flask(__name__)

gpturi = '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'

"""give me a line by line analysis of the lyrics: 
    Listen
    seeing you got ritualistic
    cleansin' my soul of addiction for now
    Cause I'm fallin' apart
    Yeah, tension
    Between us just like picket fences 
    with emotional context of ["quite contemplative"," confused"," tired","somewhat focused","moderately calm","somewhat hungry"] for each line respectively
    """



samples = [
    # if you want a descriptive emotion of the entire song, use a multi line string
    """
    Listen
    seeing you got ritualistic
    cleansin' my soul of addiction for now
    Cause I'm fallin' apart
    Yeah, tension
    Between us just like picket fences
    """
] # top five

samples2 = [
    # if you want a line by line description of the entire song, pass lyrics in line by line seperated by a comma 
    "Listen",
    "Seeing you got ritualistic",
    "Cleansin' my soul of addiction for now",
    "Cause I'm fallin' apart",
    "Yeah, tension",
    "Between us just like picket fences"
] # line by line 


EMOTIONS = np.array([
    "admiring", "adoring", "appreciative", "amused", "angry", "anxious", "awestruck", "uncomfortable", "bored", "calm",
    "focused", "contemplative", "confused", "contemptuous", "content", "hungry", "determined", "disappointed",
    "disgusted", "distressed", "doubtful", "euphoric", "embarrassed", "disturbed", "entranced", "envious", "excited",
    "fearful", "guilty", "horrified", "interested", "happy", "enamored", "nostalgic", "pained", "proud", "inspired",
    "relieved", "smitten", "sad", "satisfied", "desirous", "ashamed", "negatively surprised", "positively surprised",
    "sympathetic", "tired", "triumphant"
])

emotion_history = []
top_five = {}
processed = []

@app.route('/')
def test():
    return "Testing world"

@app.route('/topfive')
def top_five_emotions():
    asyncio.run(get_top_five())
    return top_five 

@app.route('/process')
def banana():
    asyncio.run(stringify_lines())
    return processed

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

async def get_top_five():
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

    client = HumeStreamClient("C4wQmxEcxYZ3ew3BfRGMfVValjAPmiuwsz6DMDpWnGkxVulK")
    config = LanguageConfig()
    async with client.connect([config]) as socket:
        for sample in samples:
            result = await socket.send_text(sample)
            emotions = result["language"]["predictions"][0]["emotions"]
            process_section(emotions)

    return ans

async def stringify_lines():
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

    client = HumeStreamClient("C4wQmxEcxYZ3ew3BfRGMfVValjAPmiuwsz6DMDpWnGkxVulK")
    config = LanguageConfig()
    async with client.connect([config]) as socket:
        for sample in samples2:
            result = await socket.send_text(sample)
            emotions = result["language"]["predictions"][0]["emotions"]
            a = process_section(emotions)
            ans.append(a)

    processed = ans

if __name__ == '__main__':
    app.run()

