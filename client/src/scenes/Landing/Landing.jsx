import "./Landing.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import EmotionChoice from "../../components/EmotionChoice/EmotionChoice.jsx"

const waitMessages = [
    "Scanning emotions...",
    "Finding the perfect song..."
]

const Landing = (props) => {
    const [waitMessageIndex, setWaitMessageIndex] = useState(0)
    const [waitMessage, setWaitMessage] = useState(waitMessages[0]);
    const [scan, setScan] = useState(false);
    const [chose, setChose] = useState(false);
    const [selected, setSelected] = useState("")

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
        if (!chose) {
            return "emotionChoices"
        } else {
            return "emotionChoices-dissapear"
        }
    }

    // const getWaitingMessageClassName = () => {
    //     if (chose)
    // }

    const getEmotionClassName = (emotion) => {
        if (emotion === selected) {
            return "selectedEmotion";
        } else {
            return "unselectedEmotion";
        }
    }

    const getEmoButtonClass = () => {
        if (selected) {
            return "emoButtonDark"
        } else {
            return "emoButton";
        }
    }

    const handleButtonClick = () => {
        setChose(true);
        setScan(true);
        props.setInitialEmotion(selected);
    }

    return (
      <div className="Landing">
        <div className="titleText">
          <h1>Moodify</h1>
          <span className="subTitle">Emo-lyrical Analysis</span>
        </div>

        <div className={getChoiceClassName()}>
            <div className="cards">
                <div className={getEmotionClassName("happy")}><EmotionChoice select={setSelected} emotion="Happy"/></div>
                <div className={getEmotionClassName("sad")}><EmotionChoice select={setSelected} emotion="Sad"/></div>
                <div className={getEmotionClassName("angry")}><EmotionChoice select={setSelected} emotion="Angry"/></div>
                <div className={getEmotionClassName("calm")}><EmotionChoice select={setSelected} emotion="Calm"/></div>
                <div className={getEmotionClassName("disgusted")}><EmotionChoice select={setSelected} emotion="Disgusted"/></div>
            </div>
            <button className={getEmoButtonClass()} onClick={handleButtonClick}>I'M {selected}</button>
        </div>

        { scan && <div className="scan">
          <div className="waitMessage">{waitMessage}</div>
        </div>}

        {chose && (
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