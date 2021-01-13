"use strict";

const prizes = require("../../scraper/prizes.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const prizeDataOnly = prizes.map((prize) => {
      return {
        type: prize.type,
        year: parseInt(prize.year),
        description: prize.reason,
      };
    });

    await queryInterface.bulkInsert("Prizes", prizeDataOnly, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Prizes", null, {});
  },
};
