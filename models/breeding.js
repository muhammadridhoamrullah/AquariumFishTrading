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
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Start Date is required",
          },
          notEmpty: {
            msg: "Start Date is required",
          },
        },
      },
      expectedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      offSpringCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Breeding",
    }
  );
  return Breeding;
};
