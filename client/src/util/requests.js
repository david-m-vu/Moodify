import { formatEmotionScores } from "./util.js"

const baseURL = "https://moodify-backend-t9di.onrender.com";
// const baseURL = "http://127.0.0.1:5000";


const sampleExplanations = [
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
  "Explanations are off",
];

const tempEmotions = [{
  emotions: ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"],
  scores: [0.3333, 0.2732, 0.1619, 0.1232, 0.1121]
}];

export const getExplanations = async (id, explanations) => {
  if (explanations) {
    try {
      let response = await fetch(`${baseURL}/gptexplain/${id}`);
      let responseJSON;
      if (response.ok) {
          responseJSON = await response.json();
          return responseJSON.items;
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return sampleExplanations;
  }
};

// const wait = (time) => {
//   return new Promise(resolve => {
//     setTimeout(resolve, time)
//   });
// }

export const searchSongs = async (input) => {
  if (input !== "") {
    try {
      let response = await fetch(`${baseURL}/search/${input}`);
      let responseJson;
      if (response.ok) {
        responseJson = await response.json();
        return responseJson.items;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export const retrieveSong = async (songId) => {
  try {
    let songResponse = await fetch(`${baseURL}/song/${songId}`);
    let songJson;
    if (songResponse.ok) {
      songJson = await songResponse.json();
      songJson.id = songId;
      return songJson;
    }
  } catch (err) {
    console.log(err);
  }
};

export const gptRecSong = async (emotion) => {
  try {
    if (emotion) {
      let response = await fetch(`${baseURL}/gptrecsong/${emotion}`);
      let responseJSON;
      if (response.ok) {
        responseJSON = await response.json();
        return responseJSON;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getEmotionScores = async (currentSong) => {
  try {
    let response = await fetch(`${baseURL}/topfive/${currentSong.id}`);
    let responseJSON;
    if (response.ok) {
      responseJSON = await response.json();
      return formatEmotionScores(responseJSON[0].emotions, responseJSON[0].scores);
    }
    // return formatEmotionScores(tempEmotions[0].emotions, tempEmotions[0].scores);
  } catch (err) {
    console.log(err);
  }
};  
