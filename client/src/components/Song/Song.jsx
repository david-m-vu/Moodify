import "./Song.css";

const Song = (props) => {
    return (
        <div className="Song">
            <img id="albumCover" src={props.cover} alt="album cover"/>
            <div className="info">
                <h1>{props.title}</h1>
                <h3>{props.artist}</h3>
            </div>
        </div>
    )
}

export default Song;