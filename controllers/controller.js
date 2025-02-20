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

  static async addMyFishToBreeding(req, res, next) {
    try {
      const { id } = req.params;

      const { startDate, expectedDate, success, offSpringCount, notes } =
        req.body;

      if (!startDate) {
        throw { name: "START_DATE_REQUIRED" };
      }

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

      const addingBreeding = await Breeding.create({
        MyFishId: id,
        startDate,
        expectedDate,
        success,
        offSpringCount,
        notes,
      });

      res.status(201).json({
        message: "Successfully added to Breeding",
        data: addingBreeding,
      });
    } catch (error) {
      console.log(error, "ini error addMYfISHTOBREEDING");

      next(error);
    }
  }

  static async getBreedingHistory(req, res, next) {
    try {
      const breedingHistory = await Breeding.findAll({
        include: {
          model: MyFish,
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
        },
      });
      res.status(200).json(breedingHistory);
    } catch (error) {
      next(error);
    }
  }

  static async updateBreeding(req, res, next) {
    try {
      const { id } = req.params;

      const { success, offSpringCount, notes } = req.body;

      const findBreeding = await Breeding.findByPk(id, {
        include: {
          model: MyFish,
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
        },
      });

      if (!findBreeding) {
        throw { name: "DATA_NOT_FOUND" };
      }
      console.log(findBreeding, "ini  findbreeding");

      console.log(findBreeding.MyFish?.User?.id, "ini hasil findbreeding");
      console.log(req.user.id, "ini hasil req.user.id");

      if (findBreeding.MyFish?.User?.id !== req.user.id) {
        throw { name: "FORBIDDEN" };
      }

      const updatedBreeding = await Breeding.update(
        {
          success,
          offSpringCount,
          notes,
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: "Successfully updated breeding",
        data: updatedBreeding,
      });
    } catch (error) {
      console.log(error, "ini error updateBreeding");

      next(error);
    }
  }

  static async addFish(req, res, next) {
    try {
      const {
        name,
        species,
        variant,
        age,
        size,
        grade,
        imageUrl,
        videoUrl,
        price,
        description,
        origin,
        gender,
        certificate,
      } = req.body;

      if (
        !name ||
        !species ||
        !variant ||
        !age ||
        !size ||
        !grade ||
        !imageUrl ||
        !price ||
        !origin
      ) {
        throw { name: "REQUIRED_FIELDS" };
      }

      const addingFish = await Fish.create({
        name,
        species,
        variant,
        age,
        size,
        grade,
        imageUrl,
        videoUrl,
        price,
        description,
        origin,
        certificate,
        gender,
        UserId: req.user.id,
      });

      res.status(201).json({
        message: "Successfully added fish",
        data: addingFish,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateFish(req, res, next) {
    try {
      const { id } = req.params;

      const {
        name,
        species,
        variant,
        age,
        size,
        grade,
        imageUrl,
        videoUrl,
        price,
        description,
        origin,
        gender,
        certificate,
      } = req.body;

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

      const updatedFish = await Fish.update(
        {
          name,
          species,
          variant,
          age,
          size,
          grade,
          imageUrl,
          videoUrl,
          price,
          description,
          origin,
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

  static async deleteFish(req, res, next) {
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

      const deletedFish = await Fish.destroy({
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
}

module.exports = {
  Controller,
};
