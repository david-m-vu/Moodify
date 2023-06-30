# Removes Verse Headers
import re

def remove_subtitles(lyrics):
    lyrics = re.sub(r'\[(.*?)\]', '', lyrics)
    
    return lyrics

# Removes All Spaces in Multiline Strings
def remove_spaces(lyrics):
    return "".join([s for s in lyrics.strip().splitlines(True) if s.strip()])

# Creates Array of Verses from Multiline String without subtitles
def parse_text_verse_nosubtitles(lyrics):
    lyrics_nospace = remove_spaces(lyrics)
    lyrics_nosub = remove_subtitles(lyrics_nospace)

    return_lyrics = lyrics

    if lyrics_nospace != lyrics_nosub:
        return_lyrics = lyrics_nosub

    return_lyrics = return_lyrics.split("\n\n")
    
    return return_lyrics

# Creates Array of Verses from Multiline String with subtitles
def parse_text_verse(lyrics):
    return lyrics.split("\n\n")