const router = require("express").Router();
const { authController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const {
  inputRegistration,
  validateInput,
  inputLogin,
  inputVerifyUser,
} = require("../middleware/validator");

router.post(
  "/user",
  inputRegistration,
  validateInput,
  authController.userRegistration
);
router.post("/login", inputLogin, validateInput, authController.userLogin);
router.patch(
  "/verify",
  inputVerifyUser,
  validateInput,
  verifyToken,
  authController.userVerify
);

module.exports = router;
