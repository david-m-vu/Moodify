import "./Landing.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const waitMessages = [
    "Scanning emotions...",
    "Finding the perfect song..."
]

const emotions = ["Happy", "Sad", "Angry", "Calm", "Disgusted"];


const Landing = (props) => {
    const [waitMessageIndex, setWaitMessageIndex] = useState(0)
    const [waitMessage, setWaitMessage] = useState(waitMessages[0]);
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

    const getChoicesClassName = () => {
        if (!didChoose) {
            return "emotionChoices"
        } else {
            return "emotionChoices-dissappear"
        }
    }

    const getEmotionClassName = (emotion) => {
        if (emotion === selectedEmotion) {
            return "selectedEmotion";
        } else {
            return "unselectedEmotion";
        }
    }

    const getEmoButtonClassName = () => {
        if (selectedEmotion) {
            return "emoButtonDark"
        } else {
            return "emoButton";
        }
    }

    const getLoadingClassName = () => {
        if (props.isLoading) {
            return "loading"
        } else {
            return "loading-dissappear"
        }
    }

    const handleButtonClick = () => {
        if (selectedEmotion) {
            setDidChoose(true);
            props.getInitialSong(selectedEmotion)
        }
    }

    const handleSkip = () => {
        setDidChoose(true);
        goMain();
    }

    return (
        <div className="Landing">
            <div className="titleText">
                <h1>MOODIFY</h1>
                <span className="subTitle">Emo-lyrical Analysis</span>
            </div>

            <div className={getChoicesClassName()}>
                <div className="cards">
                    {emotions.map((emotion, index) => {
                        return <div key={index} className={getEmotionClassName(emotion.toLowerCase())} onClick={() => setSelectedEmotion(emotion.toLowerCase())}>
                            <h3>{emotion}</h3>
                        </div>
                    })}
                </div>
                <button className={getEmoButtonClassName()} onClick={handleButtonClick}>I'M {selectedEmotion}</button>
                <p className="skip unselectable" onClick={handleSkip}>Skip</p>
            </div>

            {(didChoose) && <div className={getLoadingClassName()}>{waitMessage}</div>}

            {(!props.isLoading && didChoose) && (
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