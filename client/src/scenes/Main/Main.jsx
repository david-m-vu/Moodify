import "./Main.css";
import Song from "../../components/Song/Song.jsx"
// import { useState } from "react";

const tempLyrics = [`I'm findin' ways to articulate the feelin' I'm goin' through`,
`I just can't say I don't love you`,
`'Cause I love you, yeah`,
`It's hard for me to communicate the thoughts that I hold`,
`But tonight, I'm gon' let you know`,
`Let me tell the truth`,
`Baby, let me tell the truth, yeah`,
`You know what I'm thinkin', see it in your eyes`,
`You hate that you want me, hate it when you cry`,
`You're scared to be lonely, 'specially in the night`,
`I'm scared that I'll miss you, happens every time`,
`I don't want this feelin', I can't afford love`,
`I try to find a reason to pull us apart`,
`It ain't workin', 'cause you're perfect, and I know that you're worth it`,
`I can't walk away, oh`,
`Even though we're goin' through it`,
`And it makes you feel alone`,
`Just know that I would die for you`,
`Baby, I would die for you, yeah`,
`The distance and the time between us`,
`It'll never change my mind`,
`'Cause baby, I would die for you`,
`Baby, I would die for you, yeah`,
`I'm findin' ways to manipulate the feelin' you're goin' through`,
`But, baby girl, I'm not blamin' you`,
`Just don't blame me, too, yeah`,
`'Cause I can't take this pain forever`,
`And you won't find no one that's better`,
`'Cause I'm right for you, babe`,
`I think I'm right for you, babe`,
`You know what I'm thinkin', see it in your eyes`,
`You hate that you want me, hate it when you cry`,
`It ain't workin', 'cause you're perfect, and I know that you're worth it`,
`I can't walk away, oh`,
`Even though we're goin' through it`,
`And it makes you feel alone`,
`Just know that I would die for you`,
`Baby, I would die for you, yeah`,
`The distance and the time between us`,
`It'll never change my mind`,
`'Cause baby, I would die for you, uh`,
`Baby, I would die for you, yeah`,
`I would die for you, I would lie for you`,
`Keep it real with you, I would kill for you`,
`My baby`,
`I'm just sayin', yeah`,
`I would die for you, I would lie for you`,
`Keep it real with you, I would kill for you`,
`My baby`,
`Na-na-na, na-na-na, na-na, ooh`,
`Even though we're goin' through it`,
`And it makes you feel alone`,
`Just know that I would die for you`,
`Baby, I would die for you, yeah`,
`The distance and the time between us`,
`It'll never change my mind`,
`'Cause baby, I would die for you`,
`Baby, I would die for you, yeah (oh, babe)`,
]

const tempEmotions = {
    "Love": 0.53,
    "Romance": 0.42,
    "Desire": 0.24,
    "Adoration": 0.19,
    "Sadness": 0.17
}

const Main = () => {
    return (
        <div className="Main">
            <div className="songInfo">
                <Song/>
            </div>
            <div className="mainSection">
                <div className="lyrics">
                    {tempLyrics.map((line) => {
                        return <p>{line}</p>
                    })}
                </div>
                <div className="explanation">

                </div>
            </div>
            <div className="playBack">

            </div>
            <div className="emotions">
                <h1>EMOTION CHART</h1>
                <div className="emotionsList">
                    {Object.entries(tempEmotions).map(([emotion, score]) => {
                        return <p className="emotionText">{emotion + " " + score }</p>
                    })}
                </div>
            </div>
            
        </div>
    )
}

export default Main;