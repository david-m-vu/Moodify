import "./Main.css";
// import Song from "../../components/Song/Song.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { searchSongs } from "../../util/requests";
import RefreshIcon from '@mui/icons-material/Refresh';

const Main = (props) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let findSongs = async () => {
      let searchResults = await searchSongs(input);
      
      if (searchResults) {
        setSearchResults(searchResults.slice(0, 5));
      }
    }
    findSongs();
  }, [input])

  const goLanding = () => {
    navigate("../");
  };

  const closeResults = () => {
    setSearchResults([]);
    setInput("");
  };

  const handleInputChange = async (event) => {
    setInput(event.target.value);
    print("change")
  };

  const handleToggleExplanation = () => {
    props.setToggleExplanations((prev) => !prev);
  }

  const handleChooseSong = (result) => {
    props.selectSong(result);
    closeResults();
  };

  // const handleClickVerse = (index) => {
  //   setSelectedVerseIndex(index);
  // };

  const getVerseClassName = (index) => {
    if (index === selectedVerseIndex) {
      return "highlighted-verse";
    } else {
      return "regular-verse";
    }
  };

  const getInputsClassName = () => {
    if (!props.currentSong && !props.isLoading) {
      return "inputs-spotlight"
    } else {
      return "inputs"
    }
  }

  return (
    <div className="Main">
      <div className="top">
        {props.currentSong && (
          <div className="songInfo">
            {/* <Song
              title={props.currentSong.title}
              artist={props.currentSong.artist}
              cover={props.currentSong.cover}
            /> */}
            <iframe className="spotifySong" 
            title="spotify-song"
            style={{ "margin": 0, "padding": 0 }} 
            src={`https://open.spotify.com/embed/track/${props.currentSong.id}?utm_source=generator`} 
            frameBorder="0" allowFullScreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
            </iframe>
          </div>
        )}

        <div className="title">
          <h1>MOODIFY</h1>
        </div>

        <div className="search">
          <div className={getInputsClassName()}>
            <div className="searchIcon">
              <SearchIcon fontSize="large" />
            </div>
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
      </div>

      {(!props.currentSong && !props.isLoading) && <div className="dark-overlay"></div>}

      {(!props.isLoading && props.currentSong) && (
        <div className="mainSection box">
          <div className="lyrics">
            {props.verses.length !== 0 &&
              props.verses.map((verse, index) => {
                return (
                  <div className="verse" key={index}>
                    <div
                      className={getVerseClassName(index)}
                      onClick={() => setSelectedVerseIndex(index)}
                      key={index}
                    >
                      {verse.map((lyric, index) => {
                        if (lyric === "-") {
                          return <br key={index}></br>;
                        }
                        return (
                          <p className="lyric-text" key={index}>
                            {lyric}
                          </p>
                        );
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
      )}

      {(!props.isLoading && props.currentSong) && (
        <div className="emotions box">
          <div className="emotionsList">
            {Object.entries(props.topEmotions).map(
              ([emotion, score], index) => {
                return (
                  <p
                    className="emotionText"
                    key={index}
                  >{`${emotion} ${score}%`}</p>
                );
              }
            )}
          </div>
        </div>
      )}

      {(!props.isLoading && props.currentSong) &&
        <div className="recommendations box">
          <h2>RECOMMENDATIONS</h2>
          <hr></hr>
          WIP
        </div>
      }

      <div className="foot">
        <div className="moodifyMe" onClick={() => goLanding()}>
          <h2 className="moodifyMeText">Re-Moodify</h2>
          <RefreshIcon fontSize="large" />
        </div>

        <div className="expToggle">
          <input type="checkbox" checked={props.toggleExplanations} onChange={handleToggleExplanation} />
          <p>Explanations are: {props.toggleExplanations ? "On" : "Off"}</p>
        </div>
      </div>

      {props.isLoading && <div className="loadingScreen">
        <div className="loader">
        </div>
      </div>}
    </div>
  );
};

export default Main;
