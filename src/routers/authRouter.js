const router = require("express").Router();
const { authController } = require("../controllers");

router.post("/user", authController.userRegistration);
router.patch("/", authController.userVerify);

module.exports = router;
