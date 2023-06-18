import "./Main.css";
import Song from "../../components/Song/Song.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';

const baseURL = "http://127.0.0.1:5000/";

const tempEmotions = {
  Love: 0.53,
  Romance: 0.42,
  Desire: 0.24,
  Adoration: 0.19,
  Sadness: 0.17,
};

const parseLyrics = (lyrics) => {
    let newlineParsedLyrics = lyrics.split("\n");
    let parsedLyrics = [];

    for (let i = 0; i < newlineParsedLyrics.length; i++) {
        
        if (newlineParsedLyrics[i] !== '') {
            if (newlineParsedLyrics[i][0] === "[" && newlineParsedLyrics[i][newlineParsedLyrics[i].length - 1] === "]") {
                parsedLyrics.push("-")
            }
            parsedLyrics.push(newlineParsedLyrics[i]);
        } 

        if (parsedLyrics[0] === '-') {
            parsedLyrics = parsedLyrics.slice(1, parsedLyrics.length);
        }
    }
    return parsedLyrics;
}

const Main = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);


  const navigate = useNavigate();

  const goLanding = () => {
    navigate("../");
  };

  const handleInputChange = async (event) => {
    setInput(event.target.value);
    if (input !== "") {
      let response = await fetch(`${baseURL}search/${input}`);
      let responseJson;
      if (response.ok) {
        responseJson = await response.json();
      }
        setSearchResults(responseJson.items.slice(0, 5));
    } 
  };


  const handleClickVerse = (verse) => {
    setSelectedVerse(verse);
  }

  const closeResults = () => {
    setSearchResults([]);
    setInput("");
  }

  const getVerses = (lyrics) => {
    let verseArray = [];
    let verse = [];
    for (let i = 0; i < lyrics.length; i++) {
        verse.push(lyrics[i])
        if (lyrics[i] === "-") {
            verseArray.push(verse);
            verse = [];
        }
    }
    verseArray.push(verse);
    return verseArray;
  }

  const selectSong = async (song) => {
    let songResponse = await fetch(`http://127.0.0.1:5000/song/${song.id}`);
    let songJson;
    if (songResponse.ok) {
        songJson = await songResponse.json();
    }
    setCurrentSong(songJson);
    closeResults();
    // setLyrics(parseLyrics(songJson.lyrics));
    setVerses(getVerses(parseLyrics(songJson.lyrics)));
  }

  const getVerseClassName = (verse) => {
    if (verse[0] === selectedVerse[0]) {
        return "highlighted-verse";
    } else {
        return "regular-verse";
    }
  }

  return (
    <div className="Main">
      <div className="songInfo">
        {currentSong && <Song title={currentSong.title} artist={currentSong.artist} cover={currentSong.cover}/>}
      </div>

      <div className="title">
        <h1>Moodify</h1>
      </div>

      <div className="search">
        <div className="inputs">
          <input
            list="searchResults"
            type="text"
            placeholder="Search for more songs"
            value={input}
            onChange={handleInputChange}
          />
          <SearchIcon fontSize="large" />
          {(searchResults && searchResults.length !== 0) && (
            <div className="results">
              {searchResults.map((result) => {
                return (
                  <div className="result" onClick={() => selectSong(result)}>
                    <p><span className="song-title">{result.title}</span> {` - ${result.artist}`}</p>
                  </div>
                );
              })}
              <div className="close" onClick={() => closeResults()}>
                <CloseIcon fontSize="medium"/>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mainSection">
        <div className="lyrics">
          {(verses.length) !== 0 && 
            verses.map((verse) => {
                return (
                <div className="verse">
                <div className={getVerseClassName(verse)} onClick={() => handleClickVerse(verse)}>
                    {verse.map((lyric) => {
                    if (lyric === "-") {
                        return <br></br>
                    }
                    return <p className="lyric-text">{lyric}</p>  
                    }
                )
                }
                </div>
                </div>

                )
            })
          }
        </div>
        <div className="explanation"></div>
      </div>

      <div className="emotions">
        <div className="emotionsList">
          {Object.entries(tempEmotions).map(([emotion, score]) => {
            return (
              <p className="emotionText">{`${emotion} ${score * 100}%`}</p>
            );
          })}
        </div>
      </div>

      <div className="moodifyMe" onClick={() => goLanding()}>
        <h2>Moodify Me</h2>
      </div>
    </div>
  );
};

export default Main;
