const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const { validateQuery } = require("./validators/queries");
const yup = require("yup");

const app = express();

app.use(cors());

async function validationMiddleWare(req, res, next) {
  console.log("hi, i am in the middle");
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

    req.limit = limit;
    req.offset = offset;
    req.validatedQuery = validatedQuery;
    next();
  } catch (error) {
    res.status(400).json({ message: "Bad request", errors: error.errors });
  }
}

app.get("/prizes", validationMiddleWare, async (req, res) => {
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
