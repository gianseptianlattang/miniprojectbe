const router = require("express").Router();
const { authController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");

router.post("/user", authController.userRegistration);

module.exports = router;
