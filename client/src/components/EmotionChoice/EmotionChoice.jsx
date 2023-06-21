import "./EmotionChoice.css";

const EmotionChoice = (props) => {

    return (
        <div className="EmotionChoice" onClick={() => props.select(props.emotion.toLowerCase())}> 
            <h3>{props.emotion}</h3>
        </div>
    )
}

export default EmotionChoice;