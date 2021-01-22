const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const { validateQuery } = require("./validators/queries");
const yup = require("yup");

const app = express();

app.use(cors());

app.get("/prizes", async (req, res) => {
  // const limit = req.query.limit || 20;
  // const offset = req.query.offset || 0;

  // const permittedParameters = ["type", "year", "limit", "offset"];
  // const searchAbleProperties = ["type", "year"];

  // const [validatedQuery, error] = validateQuery(
  //   req.query,
  //   permittedParameters,
  //   searchAbleProperties
  // );

  // if (error) {
  //   return res.status(400).json({ message: error });
  // }

  let schema = yup
    .object()
    .shape({
      year: yup.number().integer().min(1991).max(new Date().getFullYear()),
      type: yup.string().uppercase(),
      limit: yup.number().integer().min(1).default(20),
      offset: yup.number().integer().min(0).default(0),
    })
    .noUnknown();

  try {
    const { limit, offset, ...validatedQuery } = await schema.validate(
      req.query,
      {
        abortEarly: false,
      }
    );

    console.log("QUERY:", validatedQuery);

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
