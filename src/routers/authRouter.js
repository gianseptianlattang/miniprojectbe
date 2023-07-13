const router = require("express").Router();
const { authController } = require("../controllers");

router.post("/user", authController.userRegistration);

module.exports = router;
