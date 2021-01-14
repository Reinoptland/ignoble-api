"use strict";

const prizes = require("../../scraper/prizes.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const prizeDataOnly = prizes.map((prize) => {
    //   console.log(prize);
    //   return {
    //     type: prize.type,
    //     year: parseInt(prize.year),
    //     description: prize.reason,
    //   };
    // });
    let prizeDataOnly = [];
    let researchers = [];
    for (const prize of prizes) {
      prizeDataOnly = [
        ...prizeDataOnly,
        {
          type: prize.type,
          year: parseInt(prize.year),
          description: prize.reason,
        },
      ];

      researchers = [...researchers, ...prize.winners];
    }

    const uniqueResearchers = Array.from(new Set(researchers));

    const researcherObjects = uniqueResearchers.map((name) => {
      return { name: name };
    });

    await queryInterface.bulkInsert("Prizes", prizeDataOnly, {});
    try {
      await queryInterface.bulkInsert("Researchers", researcherObjects, {});
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Prizes", null, {});
    await queryInterface.bulkDelete("Researchers", null, {});
  },
};
