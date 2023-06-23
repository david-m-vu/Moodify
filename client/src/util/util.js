export const parseLyrics = (lyrics) => {
    let newlineParsedLyrics = lyrics.split("\n");
    let parsedLyrics = [];

    for (let i = 0; i < newlineParsedLyrics.length; i++) {
        
        if (newlineParsedLyrics[i] !== '') {
            if (newlineParsedLyrics[i][0] === "[" && newlineParsedLyrics[i][newlineParsedLyrics[i].length - 1] === "]") {
                parsedLyrics.push("-")
            }
            parsedLyrics.push(newlineParsedLyrics[i]);
        } 

        if (parsedLyrics[0] === '-') {
            parsedLyrics = parsedLyrics.slice(1, parsedLyrics.length);
        }
    }
    return parsedLyrics;
}

export const formatEmotionScores = (emotions, scores) => {
    let emotionsObj = {};
    for (let i = 0; i < emotions.length; i++) {
        emotionsObj[emotions[i]] = Math.floor(scores[i] * 100);
    }
    return emotionsObj;
}