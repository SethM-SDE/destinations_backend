const { default: axios } = require("axios");

if (!process.env.PORT) {
  require("../Secrets");
}

function getUID() {
  let uid = "";
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }
  return uid;
}

async function getPhotoFromUnsplash(dest) {
  const API = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_API_KEY}&query=${dest}&page=1&per_page=1`;

  const res = await axios.get(API);

  const photos = res.data.results;
  const defaultPhoto =
    "https://charterschoolsuccess.com/wp-content/uploads/Travel.jpg";

  if (photos.length === 0) {
    return defaultPhoto;
  } else {
    return res.data.results[0].urls.thumb;
  }
}

module.exports = {
  getUID,
  getPhoto: getPhotoFromUnsplash,
};
