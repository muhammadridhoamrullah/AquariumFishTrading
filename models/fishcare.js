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
      MyFishId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "My Fish Id is required",
          },
          notEmpty: {
            msg: "My Fish Id is required",
          },
        },
      },
      temperature: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      pH: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      medication: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      feeding: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      behavior: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      checkUpDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Check Up Date is required",
          },
          notEmpty: {
            msg: "Check Up Date is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "FishCare",
    }
  );
  return FishCare;
};
