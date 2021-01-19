"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Researcher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Researcher.hasMany(models.Winner);
      Researcher.belongsToMany(models.Prize, { through: models.Winner });
    }
  }
  Researcher.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Researcher",
      timestamps: false,
    }
  );
  return Researcher;
};
