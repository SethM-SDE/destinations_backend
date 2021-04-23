// require express
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const { getUID, getPhoto } = require("./Services");

const server = express();
server.use(cors());

// expect data from json object, put on req.body
server.use(express.json());

// expect data from form, put on req.body
server.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// database
const { db } = require("./Database");

// routes
// CRUD: CREATE, READ, UPDATE, DELETE (POST, GET, PUT, DELETE)

// GET / => db  : READ operation
server.get("/", (req, res) => {
  console.log("test");
  res.send(db);
});

// POST /
// expects {name, location, description?}
// before we create the destination, we will get a photo from unsplash

server.post("/", async (req, res) => {
  const { name, location, description } = req.body;

  if (!name || !location)
    return res.status(400).json({ error: "name and location are required" });

  // generate random UID
  const uid = getUID();

  // get picture from unsplash
  const photo = await getPhoto(name);

  db.push({
    uid,
    name,
    photo,
    location,
    description: description || "",
  });

  res.send(db[db.length - 1]);
});

// PUT  /?uid
// expect {name, location, description?}

// DELETE /?uid
