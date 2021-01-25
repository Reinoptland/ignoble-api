const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const validate = require("./validators/middleware");
const yup = require("yup");

const app = express();

app.use(cors());

app.get(
  "/prizes",
  validate(
    yup
      .object()
      .shape({
        year: yup.number().integer().min(1991).max(new Date().getFullYear()),
        type: yup.string().uppercase(),
        limit: yup.number().integer().min(1).default(20),
        offset: yup.number().integer().min(0).default(0),
      })
      .noUnknown(),
    "query"
  ),
  async (req, res) => {
    const { limit, offset, ...validatedQuery } = req.validatedQuery;
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
      console.log("ERR?", error);
      res.status(400).json({ message: "Bad request", errors: error.errors });
    }
  }
);

app.get("/prizes/:id", async function (req, res, next) {
  try {
    const prize = await Prize.findByPk(req.params.id);

    res.json(prize);
  } catch (error) {
    console.log("ERR?", error);
  }
});

module.exports = app;
