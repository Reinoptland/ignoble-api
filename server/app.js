const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");

const app = express();

app.use(cors());

function formatQuery(query, searchAbleProperties) {
  const formattedQuery = {};
  // [year, type]
  for (const searchAbleProperty of searchAbleProperties) {
    //  { year: 2020, limit: 10 }
    const value = query[searchAbleProperty];

    if (value) {
      formattedQuery[searchAbleProperty] = value; // { year: 2020 }
    }
  }

  return formattedQuery;
}

function validateQuery(query, permittedProperties, searchAbleProperties) {
  const keys = Object.keys(query);
  const valid = keys.every((key) => permittedProperties.includes(key));

  if (valid) {
    const formattedQuery = formatQuery(query, searchAbleProperties);
    return [formattedQuery, null];
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
