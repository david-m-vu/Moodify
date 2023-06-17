import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Landing from "./scenes/Landing/Landing.jsx";
import Main from "./scenes/Main/Main.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Landing/>}/>
          <Route path="/main" element={ <Main/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
