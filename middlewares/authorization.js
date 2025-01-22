const { User, MyFish, Fish, FishCare, Breeding } = require("../models/index");

async function authorization(req, res, next) {
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

    if (findMyFish.UserId === req.user.id || req.user.role === "Admin") {
      next();
    } else {
      throw { name: "FORBIDDEN" };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authorization,
};
