const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// ini dk perlu, lh ado di service query
// app.get("/posts", (req, res) => {
//   res.send(posts);
// });

app.post("/posts/create", async (req, res) => { //ini sebenerny di /posts bae, tapi kareno ingress nginx dk biso bedain sesuai dengan http methodny, jd kito ganti jadi /posts/create biar dk tumburan samo GET /posts di service query
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-srv:4005/events", { //link utk ke pod lainny kalo lewat cluster ip service, kito ganti jadi exact name of the service ny. (kubernetes lh buat domain di sistem internal lookup tableny, jadi enak)
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("vFuture");
  console.log("Listening on 4000");
});
