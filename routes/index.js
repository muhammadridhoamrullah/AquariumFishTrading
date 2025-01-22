const { Controller } = require("../controllers/controller");
const { authentication } = require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");
const { errorHandling } = require("../middlewares/errorHandler");

const router = require("express").Router();

// List of available endpoints:
// - `POST /register`
// - `POST /login`
// - `POST /register/breeder` // Untuk mendaftar sebagai breeder

router.post("/register", Controller.register);
router.post("/login", Controller.login);
// router.post("/register/breeder", Controller.registerBreeder);

// Routes below need authentication:

router.use(authentication);
// - `GET /fishes` OKE
// - `GET /fishes/:id` OKE
// - `POST /myfishes/:fishId` OKE
// - `GET /myfishes` OKE
// - `GET /myfishes/stats` OKE
// - `POST /myfishes/:id/care` OKE
// - `POST /myfishes/:id/breeding`
// - `GET /breeding/history`

router.get("/fishes", Controller.getFishes);
router.get("/fishes/:id", Controller.getFishById);

router.post("/myfishes/:fishId", Controller.addFishToMyFish);
router.get("/myfishes", Controller.getMyFishes);
router.get("/myfishes/stats", Controller.getMyFishesStats);

router.post("/myfishes/:id/care", authorization, Controller.addMyFishCare);

// Routes below need breeder authentication:
// - `POST /fishes`
// - `PUT /fishes/:id`
// - `DELETE /fishes/:id`
// - `POST /fishes/:id/certificate`

// Routes below need ownership authorization:
// - `PUT /myfishes/:id` OKE
// - `DELETE /myfishes/:id` OKE
// - `PATCH /myfishes/:id/status` OKE
// - `PUT /breeding/:id`

router.put("/myfishes/:id", authorization, Controller.updateMyFish);
router.delete("/myfishes/:id", authorization, Controller.deleteMyFish);
router.patch(
  "/myfishes/:id/status",
  authorization,
  Controller.updateMyFishStatus
);

// Expert routes:
// - `POST /expert/verification/:fishId`
// - `POST /expert/healthcheck/:fishId`
// - `GET /expert/requests`

router.use(errorHandling);
module.exports = {
  router,
};
