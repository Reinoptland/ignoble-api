"use strict";

const prizes = require("../../scraper/prizes.json");
const { Prize, Researcher, Winner } = require("../models");
// console.log(Prize);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Take 1 prize -> add it to the database
    // Take all the researchers of this prize -> add them to the database
    // Add the information to the winners table
    // New strategy: use the sequelize models to seed & associate the data
    // instead of mapping, for looping ourselves -> BulkInsert (fast)
    // My new strategy it will be relatively inefficient, but easier to understand
    // let prizeDataOnly = [];
    let count = 0;
    let researchers = [];
    for (const prize of prizes) {
      // prizeDataOnly = [...prizeDataOnly];

      const storedPrize = await Prize.create({
        type: prize.type,
        year: parseInt(prize.year),
        description: prize.reason,
      });
      count++;

      let winnerIds = [];
      for (const researcherName of prize.winners) {
        const storedResearcher = await Researcher.upsert({
          // find or create the researcher
          name: researcherName,
        });
        winnerIds.push(storedResearcher[0].dataValues.id);
        count++;
      }

      for (const winnerId of winnerIds) {
        const storedWinner = await Winner.create({
          researcherId: winnerId,
          prizeId: storedPrize.dataValues.id,
        });
        count++;
      }

      console.log(`Perfomed ${count} database actions`);
    }
    console.log(`Final count: ${count} database actions`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Winners", null, {});
    await queryInterface.bulkDelete("Prizes", null, {});
    await queryInterface.bulkDelete("Researchers", null, {});
  },
};

// let prizeDataOnly = [];
// let researchers = [];
// for (const prize of prizes) {
//   prizeDataOnly = [
//     ...prizeDataOnly,
//     {
//       type: prize.type,
//       year: parseInt(prize.year),
//       description: prize.reason,
//     },
//   ];

//   researchers = [...researchers, ...prize.winners];
// }

// const uniqueResearchers = Array.from(new Set(researchers));

// const researcherObjects = uniqueResearchers.map((name) => {
//   return { name: name };
// });

// await queryInterface.bulkInsert("Prizes", prizeDataOnly, {});
// try {
//   await queryInterface.bulkInsert("Researchers", researcherObjects, {});
// } catch (error) {
//   console.log(error);
// }
