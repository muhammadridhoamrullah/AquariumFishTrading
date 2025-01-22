const { User, Fish, MyFish, FishCare, Breeding } = require("../models/index");
async function authorizationFish(req, res, next) {
  try {
    const { id } = req.params;

    const findFish = await Fish.findByPk(id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    if (!findFish) {
      throw { name: "DATA_NOT_FOUND" };
    }

    if (findFish.User?.id === req.user.id || req.user.role === "Admin") {
      next();
    } else {
      throw { name: "FORBIDDEN" };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authorizationFish,
};
