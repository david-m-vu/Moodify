import "./Main.css";
import Song from "../../components/Song/Song.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { searchSongs } from "../../util/requests";

const Main = (props) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState();

  const navigate = useNavigate();

  const goLanding = () => {
    navigate("../");
  };

  const closeResults = () => {
    setSearchResults([]);
    setInput("");
  };

  const handleInputChange = async (event) => {
    setInput(event.target.value);
    let searchResults = await searchSongs(input);
    if (searchResults) {
      setSearchResults(searchResults.slice(0, 5));
    }
  };

  const handleChooseSong = (result) => {
    props.selectSong(result);
    closeResults();
  };

  const handleClickVerse = (verse) => {
    setSelectedVerse(verse);

    let verseIndex = -1;
    for (let i = 0; i < props.verses.length; i++) {
      if (props.verses[i][0] === verse[0]) {
        verseIndex = i;
      }
    }
    setSelectedVerseIndex(verseIndex);
  };

  const getVerseClassName = (verse) => {
    if (verse[0] === selectedVerse[0]) {
      return "highlighted-verse";
    } else {
      return "regular-verse";
    }
  };

  return (
    <div className="Main">
      <div className="songInfo">
        {props.currentSong && (
          <Song
            title={props.currentSong.title}
            artist={props.currentSong.artist}
            cover={props.currentSong.cover}
          />
        )}
      </div>

      <div className="title">
        <h1>MOODIFY</h1>
      </div>

      <div className="search">
        <div className="inputs">
          <SearchIcon fontSize="large" />
          <input
            type="text"
            placeholder="Search for more songs"
            value={input}
            onChange={handleInputChange}
          />

          {searchResults && searchResults.length !== 0 && (
            <div className="results">
              {searchResults.map((result, index) => {
                return (
                  <div
                    className="result"
                    key={index}
                    onClick={() => handleChooseSong(result)}
                  >
                    <p>
                      <span className="song-title">{result.title}</span>{" "}
                      {` - ${result.artist}`}
                    </p>
                  </div>
                );
              })}
              <div className="close" onClick={() => closeResults()}>
                <CloseIcon fontSize="medium" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mainSection">
        <div className="lyrics">
          {props.verses.length !== 0 &&
            props.verses.map((verse, index) => {
              return (
                <div className="verse" key={index}>
                  <div
                    className={getVerseClassName(verse)}
                    onClick={() => handleClickVerse(verse)}
                    key={index}
                  >
                    {verse.map((lyric, index) => {
                      if (lyric === "-") {
                        return <br key={index}></br>;
                      }
                      return <p className="lyric-text" key={index}>{lyric}</p>;
                    })}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="explanation">
          {props.explanations.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <p className="explanationText">
              {props.getExplanation(selectedVerseIndex)}
            </p>
          )}
        </div>
      </div>

      <div className="emotions">
        <div className="emotionsList">
          {Object.entries(props.topEmotions).map(([emotion, score], index) => {
            return (
              <p className="emotionText" key={index}>{`${emotion} ${score}%`}</p>
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
