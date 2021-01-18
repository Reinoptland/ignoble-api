"use strict";

const prizes = require("../../scraper/prizes.json");
const sequelize = require("sequelize");
const { Prize, Researcher, Winner } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let count = 0; // counter for database calls
    let reasearcherNameSeeded = {}; // researcherNameSeeded['rein'] -> undefined

    for (const prize of prizes) {
      // gather all names of researchers Object -> O(1) { "rein": true }
      // before we create a prize, check if the winners contain a duplicate
      // if there is a duplicate, seed in the slow way (with upsert)
      // if there is no duplicate use seed in 1 go way
      let containsDuplicate = false;
      let winners = [];
      prize.winners.forEach((name) => {
        if (!reasearcherNameSeeded[name]) {
          reasearcherNameSeeded[name] = true; // { 'rein': true }
        } else {
          containsDuplicate = true;
        }
        winners = [...winners, { name: name }];
      });

      if (!containsDuplicate) {
        const result = await Prize.create(
          {
            type: prize.type,
            year: parseInt(prize.year),
            description: prize.reason,
            Researchers: winners,
          },
          { include: [Researcher] }
        );
        count++;
      } else {
        const storedPrize = await Prize.create({
          type: prize.type,
          year: parseInt(prize.year),
          description: prize.reason,
        });

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
            ResearcherId: winnerId,
            PrizeId: storedPrize.dataValues.id,
          });
          count++;
        }
      }
    }

    // amount prizes + amount prizes * winner per prize * 2 database calls
    // 297 + (297 * 3 * 2)
    // 297 + (297 * 4 * 2)

    // THE BIG O NOTATION
    // O(1) -> time constant, no matter how many elements we have FANTASTIC!
    // for (const prize of prizes) {
    //   const storedPrize = await Prize.create({
    //     type: prize.type,
    //     year: parseInt(prize.year),
    //     description: prize.reason,
    //   });
    //   count++;

    //   let winnerIds = [];
    //   for (const researcherName of prize.winners) {
    //     const storedResearcher = await Researcher.upsert({
    //       // find or create the researcher
    //       name: researcherName,
    //     });
    //     winnerIds.push(storedResearcher[0].dataValues.id);
    //     count++;
    //   }

    //   for (const winnerId of winnerIds) {
    //     const storedWinner = await Winner.create({
    //       researcherId: winnerId,
    //       prizeId: storedPrize.dataValues.id,
    //     });
    //     count++;
    //   }

    // console.log(`Perfomed ${count} database actions`);
    // }
    // console.log(`Final count: ${count} database actions`);
    // queryInterFace.bulkInsert(everything) -> if 1 validation does not pass, the whole database call is cancelled
    // We need the id of prize and a researcher to make to make the association
    // Can I insert related data with one call?
  },

  down: async (queryInterface, Sequelize) => {
    // time complexity O(1)
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
