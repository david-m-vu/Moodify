# Removes Verse Headers
def remove_subtitles(lyrics):
    lyrics = re.sub(r'\[(.*?)\]', '', lyrics)
    
    return lyrics

# Removes All Spaces in Multiline Strings
def remove_spaces(lyrics):
    return "".join([s for s in lyrics.strip().splitlines(True) if s.strip()])

# Creates Array of Lines from Multiline String
def parse_text(lyrics):
    return lyrics.split('\n')

# Creates Array of Verses from Multiline String
def parse_text_verse(lyrics):
    lyrics = remove_spaces(lyrics)
    lyrics = remove_subtitles(lyrics)
    return lyrics.split("\n\n")