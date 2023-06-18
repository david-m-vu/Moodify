from lyricsgenius import Genius

genius = Genius('iHS3WZoUY-d3I-EOKFHsWCPNSYnAtR0HGmh2bO-2rpFGfU6g2U0e1m8LXbvxDOpi')
# artist = genius.search_artist("Andy Shauf", max_songs=3, sort="title")
# print(artist.songs)

song = genius.search_song(378195)
album_id = song['album']['id']
album = genius.album(album_id)
print(album['name'])