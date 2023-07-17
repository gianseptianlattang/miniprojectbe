const router = require("express").Router();
const { authController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");

router.post("/user", authController.userRegistration);
router.post("/login", authController.userLogin);
router.patch("/verify", verifyToken, authController.userVerify);
router.patch("/verify/:tokenEmail", verifyToken, authController.userVerify);

module.exports = router;
