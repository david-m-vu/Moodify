import "./Landing.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import EmotionChoice from "../../components/EmotionChoice/EmotionChoice.jsx"

const waitMessages = [
    "Scanning emotions...",
    "Finding the perfect song..."
]

const emotions = ["Happy", "Sad", "Angry", "Calm", "Disgusted"];


const Landing = (props) => {
    const [waitMessageIndex, setWaitMessageIndex] = useState(0)
    const [waitMessage, setWaitMessage] = useState(waitMessages[0]);
    const [scan, setScan] = useState(false);
    const [didChoose, setDidChoose] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            let newWaitMessageIndex = (waitMessageIndex + 1) % 2;
            setWaitMessageIndex(newWaitMessageIndex);
            setWaitMessage(waitMessages[waitMessageIndex]);
        }, 2000)
    }, [waitMessageIndex]);

    const goMain = () => {
        navigate("/main");
    }

    const getChoiceClassName = () => {
        if (!didChoose) {
            return "emotionChoices"
        } else {
            return "emotionChoices-dissapear"
        }
    }

    const getEmotionClassName = (emotion) => {
        if (emotion === selectedEmotion) {
            return "selectedEmotion";
        } else {
            return "unselectedEmotion";
        }
    }

    const getEmoButtonClass = () => {
        if (selectedEmotion) {
            return "emoButtonDark"
        } else {
            return "emoButton";
        }
    }

    const handleButtonClick = () => {
        setDidChoose(true);
        setScan(true);
        props.setInitialEmotion(selectedEmotion);
    }

    return (
      <div className="Landing">
        <div className="titleText">
          <h1>Moodify</h1>
          <span className="subTitle">Emo-lyrical Analysis</span>
        </div>

        <div className={getChoiceClassName()}>
            <div className="cards">
                <div className={getEmotionClassName("happy")}><EmotionChoice select={setSelectedEmotion} emotion="Happy"/></div>
                <div className={getEmotionClassName("sad")}><EmotionChoice select={setSelectedEmotion} emotion="Sad"/></div>
                <div className={getEmotionClassName("angry")}><EmotionChoice select={setSelectedEmotion} emotion="Angry"/></div>
                <div className={getEmotionClassName("calm")}><EmotionChoice select={setSelectedEmotion} emotion="Calm"/></div>
                <div className={getEmotionClassName("disgusted")}><EmotionChoice select={setSelectedEmotion} emotion="Disgusted"/></div>

            </div>
            <button className={getEmoButtonClass()} onClick={handleButtonClick}>I'M {selectedEmotion}</button>
        </div>

        { scan && <div className="scan">
          <div className="waitMessage">{waitMessage}</div>
        </div>}

        {didChoose && (
          <div className="next">
            <span className="subTitle">Your curated song is ready!</span>
            <div id="arrowIcon" onClick={() => goMain()}>
              <ArrowCircleRightIcon fontSize="large" />
            </div>
          </div>
        )}
      </div>
    );
}

export default Landing;