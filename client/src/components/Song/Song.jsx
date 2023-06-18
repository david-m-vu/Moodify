import "./Song.css";

const Song = (props) => {
    //temp 
    
    return (
        <div className="Song">
            <img id="albumCover" src={"https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"} alt="album cover"/>
            <div className="info">
                <h1>Deez Nuts</h1>
                <h3>Bro</h3>
            </div>
        </div>
    )
}

export default Song;