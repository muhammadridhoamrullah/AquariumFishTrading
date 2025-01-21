"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MyFish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MyFish.belongsTo(models.User, { foreignKey: "UserId" });
      MyFish.belongsTo(models.Fish, { foreignKey: "FishId" });
      MyFish.hasMany(models.Breeding, { foreignKey: "MyFishId" });
      MyFish.hasMany(models.FishCare, { foreignKey: "MyFishId" });
    }
  }
  MyFish.init(
    {
      UserId: DataTypes.INTEGER,
      FishId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      purchaseDate: DataTypes.DATE,
      lastCheckUp: DataTypes.DATE,
      notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MyFish",
    }
  );
  return MyFish;
};
