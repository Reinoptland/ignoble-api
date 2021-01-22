const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const { validatePrizesQueries } = require("./validators");
const yup = require("yup");

const app = express();

app.use(cors());

// A DESIGN PATTERN:
// A FACTORY PATTERN

app.get("/prizes", validatePrizesQueries, async (req, res) => {
  // validation middleware
  // validating / casting the query
  // - validation error
  // - other

  // route handler
  // queryin the database
  // success response
  // error responses
  // - no data found
  // - other
  const { limit, offset, validatedQuery } = req;
  try {
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
  } catch (error) {
    res.status(400).json({ message: "Bad request", errors: error.errors });
  }
});

module.exports = app;
