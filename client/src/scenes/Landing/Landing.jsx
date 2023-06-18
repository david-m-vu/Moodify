import "./Landing.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const waitMessages = [
    "Reading your face...",
    "Scanning emotions...",
    "Finding the perfect song..."
]

const Landing = () => {
    const [waitMessageIndex, setWaitMessageIndex] = useState(0)
    const [waitMessage, setWaitMessage] = useState(waitMessages[0]);
    const [isWaiting, setIsWaiting] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            let newWaitMessageIndex = (waitMessageIndex + 1) % 3;
            setWaitMessageIndex(newWaitMessageIndex);
            setWaitMessage(waitMessages[waitMessageIndex]);
        }, 1000)
    }, [waitMessageIndex]);

    // first api call to hume
    useEffect(() => {
        // make request to backend
        // provide streaming data or image to hume ai
        // when request is finished, set isWaiting to true;

        //temp function to move to next page (main)
        setTimeout(() => {
            console.log("waiting...");
            setIsWaiting(false);
        }, 6000)
    }, [navigate]);

    const goMain = () => {
        navigate("/main");
    }

    const getScanClassName = () => {
        if (isWaiting) {
            return "scan"
        } else {
            return "scan-disappear"
        }
    }

    return (
      <div className="Landing">
        <div className="titleText">
          <h1>Moodify</h1>
          <span className="subTitle">Emo-lyrical Analysis</span>
        </div>
        <div className={getScanClassName()}>
          <div className="waitMessage">{waitMessage}</div>
          <div className="camera"></div>
        </div>
        {!isWaiting && (
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