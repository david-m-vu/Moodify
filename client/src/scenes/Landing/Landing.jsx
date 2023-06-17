import "./Landing.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

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

    const switchMessage = useEffect(() => {
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
            navigate("/main")
        }, 6000)
    }, [navigate]);


    return (
        <div className="Landing">
            <div className="titleText">
                <h1>Moodify</h1>
                <span className="subTitle">Emo-lyrical Analysis</span>
            </div>
            <div className="scan">
                <div className="waitMessage">{waitMessage}</div>
                <div className="camera"></div>
            </div>
        </div>
    )
}

export default Landing;