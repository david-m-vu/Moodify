import { formatEmotionScores } from "./util.js"

const baseURL = "http://127.0.0.1:5000";

const sampleExplanations = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "exp 2",
  "exp 3",
  "exp 4",
  "exp 5",
  "exp 6",
  "exp 7",
  "exp 8",
  "exp 9",
  "exp 10",
  "exp 11",
  "exp 12",
  "exp 13",
  "exp 14",
];

const tempEmotions = [{
  emotions: ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"],
  scores: [0.3333, 0.2732, 0.1619, 0.1232, 0.1121]
}];

export const getExplanations = async (id) => {
  let response = await fetch(`${baseURL}/gptexplain/${id}`);
  let responseJSON;
  if (response.ok) {
      responseJSON = await response.json();
  }
  return responseJSON.items;
  // return sampleExplanations;
};

export const searchSongs = async (input) => {
  if (input !== "") {
    let response = await fetch(`${baseURL}/search/${input}`);
    let responseJson;
    if (response.ok) {
      responseJson = await response.json();
    }
    return responseJson.items;
  }
};

export const retrieveSong = async (songId) => {
  let songResponse = await fetch(`${baseURL}/song/${songId}`);
  let songJson;
  if (songResponse.ok) {
    songJson = await songResponse.json();
  }
  songJson.id = songId;
  return songJson;
};

export const gptRecSong = async (emotion) => {
  if (emotion) {
    let response = await fetch(`${baseURL}/gptrecsong/${emotion}`);
    let responseJSON;
    if (response.ok) {
      responseJSON = await response.json();
    }
    return responseJSON;
  }
};

export const getEmotionScores = async (currentSong) => {
  let response = await fetch(`${baseURL}/topfive/${currentSong.id}`);
  let responseJSON;
  if (response.ok) {
    responseJSON = await response.json();
  }
  return formatEmotionScores(responseJSON[0].emotions, responseJSON[0].scores);

  // return formatEmotionScores(tempEmotions[0].emotions, tempEmotions[0].scores);
};  
