const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { Prize } = require("./models");

app.use(cors());

app.get("/prizes", async (req, res) => {
  const prizes = await Prize.findAll();
  res.json(prizes);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
