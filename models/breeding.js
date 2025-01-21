"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Breeding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Breeding.belongsTo(models.MyFish, { foreignKey: "MyFishId" });
    }
  }
  Breeding.init(
    {
      MyFishId: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      expectedDate: DataTypes.DATE,
      success: DataTypes.BOOLEAN,
      offSpringCount: DataTypes.INTEGER,
      notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Breeding",
    }
  );
  return Breeding;
};
