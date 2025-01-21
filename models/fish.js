"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Fish.hasMany(models.MyFish, { foreignKey: "FishId" });
      Fish.belongsTo(models.User, { foreignKey: "UserId" });
      
    }
  }
  Fish.init(
    {
      name: DataTypes.STRING,
      species: DataTypes.STRING,
      variant: DataTypes.STRING,
      age: DataTypes.INTEGER,
      size: DataTypes.FLOAT,
      grade: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      origin: DataTypes.STRING,
      gender: DataTypes.STRING,
      certificate: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Fish",
    }
  );
  return Fish;
};
