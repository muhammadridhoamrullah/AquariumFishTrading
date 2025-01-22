const { verifyToken } = require("../helpers/jwt");
const { User, MyFish, Fish, FishCare, Breeding } = require("../models/index");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw { name: "UNAUTHORIZED" };
    }

    const token = authorization.split(" ")[1];

    const payload = verifyToken(token);

    const findUser = await User.findByPk(payload.id);

    if (!findUser) {
      throw { name: "UNAUTHORIZED" };
    }

    req.user = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authentication,
};
