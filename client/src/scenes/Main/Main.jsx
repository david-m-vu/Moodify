import "./Main.css";
import Song from "../../components/Song/Song.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';

import { parseLyrics } from "../../util/util";
import { getExplanations, searchSongs, getEmotions, retrieveSong } from "../../util/requests"

const Main = (props) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState();
  
  const [currentSong, setCurrentSong] = useState(null);
  const [verses, setVerses] = useState([]);
  const [explanations, setExplanations] = useState([])
  const [topEmotions, setTopEmotions] = useState([]);

  const navigate = useNavigate();

  const goLanding = () => {
    navigate("../");
  };

  const closeResults = () => {
    setSearchResults([]);
    setInput("");
  }

  const handleInputChange = async (event) => {
    setInput(event.target.value);
    let searchResults = await searchSongs(input);
    if (searchResults) {
      setSearchResults(searchResults.slice(0, 5));
    }
  };

  const getExplanation = () => {
    return explanations[selectedVerseIndex];
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
    let retrievedSong = await retrieveSong(song.id);

    setCurrentSong(retrievedSong);
    closeResults();

    // setLyrics(parseLyrics(songJson.lyrics));
    setVerses(getVerses(parseLyrics(retrievedSong.lyrics)));
    setExplanations(await getExplanations(retrievedSong.id));   
    setTopEmotions(await getEmotions(currentSong));
  }

//   useEffect(() => {
//     // if (!props.initalEmotion) {
//         const getInitialSong = async () => {
//             let response = await fetch(`${baseURL}/gptrecsong/${props.initialEmotion}`);
//             let responseJSON;
//             if (response.ok) {
//                 responseJSON = await response.json();
//             }
    
//             selectSong(responseJSON);
//         }
//         getInitialSong();

//   }, [])

const handleClickVerse = (verse) => {
  setSelectedVerse(verse);

  let verseIndex = -1;
  for (let i = 0; i < verses.length; i++) {
      if (verses[i][0] === verse[0]) {
          verseIndex = i;
      }
  }
  setSelectedVerseIndex(verseIndex);
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
        <h1>MOODIFY</h1>
      </div>

      <div className="search">
        <div className="inputs">
          <SearchIcon fontSize="large" />
          <input
            list="searchResults"
            type="text"
            placeholder="Search for more songs"
            value={input}
            onChange={handleInputChange}
          />

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
        <div className="explanation">
            { (explanations.length === 0) ? <p>Loading...</p> : <p className="explanationText">{getExplanation()}</p>}
        </div>
      </div>

      <div className="emotions">
        <div className="emotionsList">
          {Object.entries(topEmotions).map(([emotion, score]) => {
            return (
              <p className="emotionText">{`${emotion} ${score * 100}%`}</p>
            );
          })}
        </div>
      </div>

      <div className="moodifyMe" onClick={() => goLanding()}>
        <h2>Moodify Me Again</h2>
      </div>
    </div>
  );
};

export default Main;
