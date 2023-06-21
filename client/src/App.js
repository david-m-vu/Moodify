import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./scenes/Landing/Landing.jsx";
import Main from "./scenes/Main/Main.jsx";

import { parseLyrics } from "./util/util";
import {
  getExplanations,
  getEmotions,
  retrieveSong,
  gptRecSong
} from "./util/requests";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [verses, setVerses] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [topEmotions, setTopEmotions] = useState([]);

  const selectSong = async (song) => {
    let retrievedSong = await retrieveSong(song.id);
    setCurrentSong(retrievedSong);

    // let explanationsPromise = getExplanations(retrievedSong.id);

    // setLyrics(parseLyrics(songJson.lyrics));
    setVerses(getVerses(parseLyrics(retrievedSong.lyrics)));
    setExplanations(await getExplanations(retrievedSong.id));
    setTopEmotions(await getEmotions(currentSong));
  };

  const getExplanation = (selectedVerseIndex) => {
    return explanations[selectedVerseIndex];
  };

  const getVerses = (lyrics) => {
    let verseArray = [];
    let verse = [];
    for (let i = 0; i < lyrics.length; i++) {
      verse.push(lyrics[i]);
      if (lyrics[i] === "-") {
        verseArray.push(verse);
        verse = [];
      }
    }
    verseArray.push(verse);
    return verseArray;
  };

  const getInitialSong = async (initialEmotion) => {
      let recommendedSong = await gptRecSong(initialEmotion);
      selectSong(recommendedSong);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Landing getInitialSong={getInitialSong} />}
          />
          <Route
            path="/main"
            element={
              <Main
                selectSong={selectSong}
                getExplanation={getExplanation}
                currentSong={currentSong}
                verses={verses}
                explanations={explanations}
                topEmotions={topEmotions}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
