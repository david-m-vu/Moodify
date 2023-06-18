import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react";
import Landing from "./scenes/Landing/Landing.jsx";
import Main from "./scenes/Main/Main.jsx";

function App() {  
  const [initialEmotion, setInitialEmotion] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Landing setInitialEmotion={setInitialEmotion}/>}/>
          <Route path="/main" element={ <Main initialEmotion={initialEmotion}/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
