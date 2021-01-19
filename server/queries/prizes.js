const { Prize, Researcher } = require("../models");
const { Op } = require("sequelize");

// Making a query:
// import a model
// async function (because queries take time)
// Call a method on the model to perform a query
// Finders: findAll, findByPk, findOne, findOrCreate, findAndCountAll
// Where Object -> what do we want

async function findAllPrizes() {
  const prizes = await Prize.findAll();
  return prizes;
}

// prizeType: parameter
// - placeholder
// - we do not the value ahead of time
// - we only know the value when the function gets called
async function findPrizeByType(prizeType) {
  const prizes = await Prize.findAll({ where: { type: prizeType }, raw: true });
  return prizes;
}

// When you call a function you pass in: an argument
// - actual value
// console.log("what is prize.type", Prize.type);
// findPrizeByType("PEACE");
// findPrizeByType("PHYSICS");

async function findPrizesByTypes(prizeTypes) {
  const prizes = await Prize.findAll({
    raw: true,
    where: {
      type: {
        [Op.in]: prizeTypes,
      },
    },
  });

  return prizes;
}

// findPrizesByTypes(["PEACE", "PHYSICS"]);

async function findPrizesFromPeriod(startYear, endYear) {
  const prizes = await Prize.findAll({
    where: {
      year: {
        [Op.between]: [startYear, endYear],
      },
    },
    order: [["year", "ASC"]],
    // raw: true,
    include: [
      {
        model: Researcher,
        required: false,
        where: { name: { [Op.startsWith]: "P" } },
      },
    ],
    // plain: true,
  });

  console.log(prizes);
}

findPrizesFromPeriod(2001, 2003);

// GET /prizetype/:prizeType/prizes
// GET /prizes?type=PEACE
// GET /prizes?types=PEACE,PHYSICS
// GET /prize-types -> ["PEACE", "PHYSICS", "MEDICINE"]
// GET /prizes?year=2020
// GET /prizes?search=cheese
// GET /countries/NL/prizes
// GET /prizes/:id/researchers
// GET / -> json with options
