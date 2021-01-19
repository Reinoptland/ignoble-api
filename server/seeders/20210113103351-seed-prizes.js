"use strict";

const prizes = require("../data/prizes.json");
const sequelize = require("sequelize");
const { Prize, Researcher, Winner } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let count = 0;
    let reasearcherNameSeeded = {};

    for (const prize of prizes) {
      let containsDuplicate = false;
      let winners = [];
      prize.winners.forEach((name) => {
        if (!reasearcherNameSeeded[name]) {
          reasearcherNameSeeded[name] = true;
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
        count++;

        let winnerIds = [];
        for (const researcherName of prize.winners) {
          const [storedResearcher, created] = await Researcher.findOrCreate({
            where: {
              name: researcherName,
            },
          });
          winnerIds.push(storedResearcher.dataValues.id);
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
    console.log("Number of database calls: ", count);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Winners", null, {});
    await queryInterface.bulkDelete("Prizes", null, {});
    await queryInterface.bulkDelete("Researchers", null, {});
  },
};
