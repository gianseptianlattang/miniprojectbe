const router = require("express").Router();
const { authController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const { inputRegistration, validateInput } = require("../middleware/validator");

router.post(
  "/user",
  inputRegistration,
  validateInput,
  authController.userRegistration
);
router.post("/login", authController.userLogin);
router.patch("/verify", verifyToken, authController.userVerify);
router.patch(
  "/change-password",
  verifyToken,
  checkUserVerification,
  authController.changePassword
);
router.put("/forgot-password", authController.forgotPassword);
router.patch(
  "/password",
  verifyToken,
  checkUserVerification,
  authController.resetPassword
);

module.exports = router;
