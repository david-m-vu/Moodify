import secret
from lyric_processing import parse_text_verse_nosubtitles
from hume_outputs import stringify
import openai

openai.organization = secret.organization_id
openai.api_key = secret.open_ai_key
openai.Model.list()

def gpt_explain(lyrics):
    mood_strings = stringify(lyrics)
    lyrics = parse_text_verse_nosubtitles(lyrics.strip("'"))
    print(f"lyrics successfully stringified ({len(mood_strings)} to parse)")

    gpt_explanation = []

    for i, stanza in enumerate(lyrics):
        mood_string = mood_strings[i]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a song analyzer."},
                {"role": "user", "content": "Analze the following verse: " + stanza},
                {"role": "user", "content": "Use this emotional context in your analysis: " + mood_string}
            ]
        )

        message_content = response["choices"][0]["message"]["content"]
        gpt_explanation.append(message_content)
        print(f"verse {i + 1} was finished parsing")

    print("Finished parsing all verses, returning explanation")
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