const express = require("express");
const cors = require("cors");
const { Prize } = require("./models");
const validate = require("./validators/middleware");
const yup = require("yup");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));

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
      console.error("ERR?", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get(
  "/prizes/:id",
  validate(
    yup.object().shape({ id: yup.number().positive().integer() }),
    "params"
  ),
  async function (req, res) {
    const { id } = req.validatedParams;
    try {
      const prize = await Prize.findByPk(id);
      if (prize === null) {
        res.status(404);
      }
      res.json(prize);
    } catch (error) {
      console.error("ERR?", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = app;
