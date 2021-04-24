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
  const { location } = req.params;
  
  if (!location) return res.send(db);
  
  const locations = db.filter((dest) => dest.location.toLowerCase() === location.toLowerCase());
  
  return res.send(locations);
  
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
  res.redirect("/")
  //res.send(db[db.length - 1]);
});

// PUT  /?uid
// expect {name, location, description?}
server.put("/", async (req, res) => {
  const { uid } = req.query;

  if (!uid || uid.toString().length !== 6)
    return res.status(400).json({ error: "uid is a required 6 digit number" });

  const { name, location, description } = req.body;

  if (!name && !location && !description) {
    return res
      .status(400)
      .json({ error: "at least one property must be provided to update" });
  }

  const edit = db.find((dest) => dest.uid === uid);
  if (edit === undefined) return res.status("uid not found");
  if (name) {
    edit.name = name;
    edit.photo = await getPhoto(edit.name);
  }
  edit.location = location || edit.location;
  edit.description = description || edit.location;

  res.send(db);
});
// DELETE /?uid
server.delete("/", (req, res) => {
  const { uid } = req.query;

  if (!uid || uid.toString().length !== 6)
    return res.status(400).json({ error: "uid is a required 6 digit number" });

  const del = db.find((dest) => dest.uid === uid);
  if (del === undefined) return res.status("uid not found");
  const idx = db.indexOf(del);
  db.splice(idx, 1);

  res.send(db);
});
