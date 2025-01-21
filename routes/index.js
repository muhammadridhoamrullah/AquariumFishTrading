const { Controller } = require("../controllers/controller");

const router = require("express").Router();

// List of available endpoints:
// - `POST /register`
// - `POST /login`
// - `POST /register/breeder` // Untuk mendaftar sebagai breeder

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/register/breeder", Controller.registerBreeder);

// Routes below need authentication:

// - `GET /fishes` OKE
// - `GET /fishes/:id`
// - `GET /fishes/search`
// - `POST /myfishes/:fishId` OKE
// - `GET /myfishes`
// - `GET /myfishes/stats` OKE
// - `POST /myfishes/:id/care`
// - `POST /myfishes/:id/breeding` OKE
// - `GET /breeding/history`

router.get("/fishes", Controller.getFishes);

// Routes below need breeder authentication:
// - `POST /fishes` OKE
// - `PUT /fishes/:id`
// - `DELETE /fishes/:id`
// - `POST /fishes/:id/certificate`

// Routes below need ownership authorization:
// - `PUT /myfishes/:id`
// - `DELETE /myfishes/:id`
// - `PATCH /myfishes/:id/status`
// - `PUT /breeding/:id`

// Expert routes:
// - `POST /expert/verification/:fishId`
// - `POST /expert/healthcheck/:fishId` OKE
// - `GET /expert/requests`

module.exports = {
  router,
};
