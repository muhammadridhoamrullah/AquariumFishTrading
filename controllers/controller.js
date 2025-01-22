const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const {
  User,
  MyFish,
  Fish,
  FishCare,
  Breeding,
  sequelize,
} = require("../models/index");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, role, storeName, location } = req.body;

      if (!email || !password || !role) {
        throw { name: "EMAIL_PASSWORD_ROLE_REQUIRED" };
      }

      const registering = await User.create({
        email,
        password,
        role,
        storeName,
        location,
      });

      res.status(201).json({
        id: registering.id,
        email: registering.email,
        role: registering.role,
        storeName: registering.storeName,
        location: registering.location,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: "EMAIL_PASSWORD_REQUIRED" };
      }

      const findEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (!findEmail) {
        throw { name: "EMAIL_PASSWORD_INVALID" };
      }

      const checkPassword = comparePassword(password, findEmail.password);

      if (!checkPassword) {
        throw { name: "EMAIL_PASSWORD_INVALID" };
      }

      const access_token = signToken({
        id: findEmail.id,
        email: findEmail.email,
      });

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFishes(req, res, next) {
    try {
      const allFishes = await Fish.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      });

      res.status(200).json(allFishes);
    } catch (error) {
      next(error);
    }
  }

  static async getFishById(req, res, next) {
    try {
      const { id } = req.params;

      const findFish = await Fish.findByPk(id, {
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      });

      if (!findFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      res.status(200).json(findFish);
    } catch (error) {
      next(error);
    }
  }

  static async addFishToMyFish(req, res, next) {
    try {
      const { fishId } = req.params;
      const { status, purchaseDate, notes, lastCheckUp } = req.body;

      if (!status || !purchaseDate) {
        throw { name: "STATUS_PURCHASEDATE_REQUIRED" };
      }

      if (!fishId) {
        throw { name: "FISH_ID_REQUIRED" };
      }

      const noDoubleFish = await MyFish.findOne({
        where: {
          FishId: fishId,
          UserId: req.user.id,
        },
      });

      if (noDoubleFish) {
        throw { name: "NO_DUPLICATE" };
      }

      const findFish = await Fish.findByPk(fishId, {
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      });

      if (!findFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      const addingToMyFish = await MyFish.create({
        UserId: req.user.id,
        FishId: fishId,
        status,
        purchaseDate,
        notes,
        lastCheckUp,
      });

      res.status(201).json({
        message: "Successfully added to My Fish",
        data: addingToMyFish,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyFishes(req, res, next) {
    try {
      const myFishes = await MyFish.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [
          {
            model: Fish,
          },
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      });

      res.status(200).json(myFishes);
    } catch (error) {
      next(error);
    }
  }

  static async getMyFishesStats(req, res, next) {
    try {
      const totalFish = await MyFish.count({
        where: {
          UserId: req.user.id,
        },
      });

      const fishValues = await MyFish.findAll({
        where: {
          UserId: req.user.id,
        },
        include: {
          model: Fish,
        },
      });

      const totalValue = fishValues.reduce((acc, el) => {
        return acc + el.Fish.price;
      }, 0);

      const bySpecies = fishValues.reduce((acc, el) => {
        if (!acc[el.Fish.species]) {
          acc[el.Fish.species] = 1;
        } else {
          acc[el.Fish.species]++;
        }
        return acc;
      }, {});

      const healthStatus = await MyFish.count({
        where: { UserId: req.user.id },
        group: ["status"],
      });

      const formatHealthStatus = {
        Healthy: 0,
        Breeding: 0,
        Status: 0,
        Treating: 0,
      };

      const newStatus = healthStatus.reduce((acc, el) => {
        acc[el.status] = el.count;
        return acc;
      }, formatHealthStatus);

      res.status(200).json({
        totalFish,
        totalValue,
        bySpecies,

        status: newStatus,
      });
    } catch (error) {
      console.log(error, "error");

      next(error);
    }
  }

  static async updateMyFish(req, res, next) {
    try {
      const { id } = req.params;

      const { status, purchaseDate, notes, lastCheckUp } = req.body;

      const findMyFish = await MyFish.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: Fish,
          },
        ],
      });

      if (!findMyFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      const updatedFish = await MyFish.update(
        {
          status,
          purchaseDate,
          notes,
          lastCheckUp,
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: "Successfully updated",
        data: updatedFish,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMyFish(req, res, next) {
    try {
      const { id } = req.params;

      const findMyFish = await MyFish.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: Fish,
          },
        ],
      });

      if (!findMyFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      const deletedFish = await MyFish.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: "Successfully deleted",
        data: deletedFish,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMyFishStatus(req, res, next) {
    try {
      const { id } = req.params;

      const { status } = req.body;

      if (!status) {
        throw { name: "STATUS_REQUIRED" };
      }
      const findMyFish = await MyFish.findByPk(id);

      if (!findMyFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      const updatedFish = await MyFish.update(
        {
          status,
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: "Successfully updated status",
        data: updatedFish,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMyFishCare(req, res, next) {
    try {
      const { id } = req.params;

      const { temperature, pH, medication, feeding, behavior } = req.body;

      const findMyFish = await MyFish.findByPk(id);

      if (!findMyFish) {
        throw { name: "DATA_NOT_FOUND" };
      }

      const addingCare = await FishCare.create({
        MyFishId: id,
        temperature,
        pH,
        medication,
        feeding,
        behavior,
        checkUpDate: new Date(),
      });

      res.status(201).json({
        message: "Successfully added care",
        data: addingCare,
      });
    } catch (error) {
      console.log(error, "ini error addMYfISHcARE");

      next(error);
    }
  }
}

module.exports = {
  Controller,
};
