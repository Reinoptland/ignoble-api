const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const { validateQuery } = require("./validators/queries");

const app = express();

app.use(cors());

app.get("/prizes", async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  const permittedParameters = ["type", "year", "limit", "offset"];
  const searchAbleProperties = ["type", "year"];

  const [validatedQuery, error] = validateQuery(
    req.query,
    permittedParameters,
    searchAbleProperties
  );

  if (error) {
    return res.status(400).json({ message: error });
  }

  const { count, rows } = await Prize.findAndCountAll({
    limit: limit,
    offset: offset,
    where: {
      ...validatedQuery,
    },
  });

  if (count === 0) {
    return res.status(404).json({ count, prizes: [] });
  }

  res.json({ count, prizes: rows });
});

module.exports = app;
