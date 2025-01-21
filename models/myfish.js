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
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User Id is required",
          },
          notEmpty: {
            msg: "User Id is required",
          },
        },
      },
      FishId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Fish Id is required",
          },
          notEmpty: {
            msg: "Fish Id is required",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Status is required",
          },
          notEmpty: {
            msg: "Status is required",
          },
        },
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Purchase Date is required",
          },
          notEmpty: {
            msg: "Purchase Date is required",
          },
        },
      },
      lastCheckUp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MyFish",
    }
  );
  return MyFish;
};
