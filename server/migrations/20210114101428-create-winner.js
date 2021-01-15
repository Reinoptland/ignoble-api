"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Winners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      prizeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Prizes", // name of Target model (plural)
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      researcherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Researchers", // name of Target model (plural)
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Winners");
  },
};
