const router = require("express").Router();
const { passwordController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const {
  validateInput,
  inputChangePassword,
  inputForgotPassword,
  inputResetPassword,
} = require("../middleware/validator");

router.patch(
  "/change",
  inputChangePassword,
  validateInput,
  verifyToken,
  checkUserVerification,
  passwordController.changePassword
);
router.put(
  "/forgot-password",
  inputForgotPassword,
  validateInput,
  passwordController.forgotPassword
);
router.patch(
  "/reset",
  inputResetPassword,
  validateInput,
  verifyToken,
  checkUserVerification,
  passwordController.resetPassword
);

module.exports = router;
