const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");

const app = express();

app.use(cors());

app.get("/prizes", async (req, res) => {
  const prizes = await Prize.findAll();
  res.json(prizes);
});

module.exports = app;
