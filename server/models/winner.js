"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Winner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Winner.belongsTo(models.Prize);
      Winner.belongsTo(models.Researcher);
    }
  }
  Winner.init(
    {
      PrizeId: DataTypes.INTEGER,
      ResearcherId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Winner",
      timestamps: false,
    }
  );
  return Winner;
};
