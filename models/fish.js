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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      species: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Species is required",
          },
          notEmpty: {
            msg: "Species is required",
          },
        },
      },
      variant: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Variant is required",
          },
          notEmpty: {
            msg: "Variant is required",
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Age is required",
          },
          notEmpty: {
            msg: "Age is required",
          },
        },
      },
      size: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Size is required",
          },
          notEmpty: {
            msg: "Size is required",
          },
        },
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Grade is required",
          },
          notEmpty: {
            msg: "Grade is required",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image Url is required",
          },
          notEmpty: {
            msg: "Image Url is required",
          },
        },
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price is required",
          },
          notEmpty: {
            msg: "Price is required",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Origin is required",
          },
          notEmpty: {
            msg: "Origin is required",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      certificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
    },
    {
      sequelize,
      modelName: "Fish",
    }
  );
  return Fish;
};
