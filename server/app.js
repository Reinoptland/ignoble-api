const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");

const app = express();

app.use(cors());

function validateQuery(query, permittedProperties) {
  const keys = Object.keys(query);
  const valid = keys.every((key) => permittedProperties.includes(key));

  if (valid) {
    return [query, null];
  } else {
    return [
      null,
      `Invalid parameter, acceptable parameters are: ${permittedProperties.join(
        ", "
      )}`,
    ];
  }
}

app.get("/prizes", async (req, res) => {
  const [validatedQuery, error] = validateQuery(req.query, ["type", "year"]);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const prizes = await Prize.findAll({
    where: {
      ...validatedQuery,
    },
  });

  if (prizes.length === 0) {
    return res.status(404).json([]);
  }

  res.json(prizes);
});

module.exports = app;
