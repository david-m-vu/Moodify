const baseURL = "http://127.0.0.1:5000";

const sampleExplanations = ["exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1exp 1", 
"exp 2", "exp 3", "exp 4", "exp 5", "exp 6", "exp 7", "exp 8", "exp 9", "exp 10", "exp 11",
"exp 12", "exp 13", "exp 14",]

const tempEmotions = {
    Love: 0.53,
    Romance: 0.42,
    Desire: 0.24,
    Adoration: 0.19,
    Sadness: 0.17,
  };

export const getExplanations = async (id) => {
    // let response = await fetch(`${baseURL}/gptexplain/${id}`);
    // console.log(response);
    // let responseJSON;
    // if (response.ok) {
    //     responseJSON = await response.json();
    // }
    // console.log(responseJSON.items);
    // return responseJSON.items;
    return sampleExplanations;
  }

  export const searchSongs = async (input) => {
    if (input !== "") {
        let response = await fetch(`${baseURL}/search/${input}`);
        let responseJson;
        if (response.ok) {
          responseJson = await response.json();
        }
        return responseJson.items;
    } 
  }

  export const retrieveSong = async (songId) => {
    let songResponse = await fetch(`${baseURL}/song/${songId}`);
    let songJson;
    if (songResponse.ok) {
        songJson = await songResponse.json();
    }
    songJson.id = songId
    return songJson;
  }

  export const getEmotions = async (currentSong) => {
    // let response = await fetch(`${baseURL}/topfive/${currentSong.id}`);
    
    // if (response.ok) {

    // }

    return tempEmotions;
  }