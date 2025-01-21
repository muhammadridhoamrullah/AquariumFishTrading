"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FishCare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FishCare.belongsTo(models.MyFish, { foreignKey: "MyFishId" });
    }
  }
  FishCare.init(
    {
      MyFishId: DataTypes.INTEGER,
      temperature: DataTypes.FLOAT,
      pH: DataTypes.FLOAT,
      medication: DataTypes.STRING,
      feeding: DataTypes.STRING,
      behavior: DataTypes.STRING,
      checkUpDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "FishCare",
    }
  );
  return FishCare;
};
