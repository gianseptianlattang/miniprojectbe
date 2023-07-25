const router = require("express").Router();
const { profileController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const {
  validateInput,
  inputChangeUsername,
  inputChangeEmail,
  inputChangePhone,
  inputChangeAvatar,
} = require("../middleware/validator");

router.patch(
  "/username",
  inputChangeUsername,
  validateInput,
  verifyToken,
  checkUserVerification,
  profileController.changeUsername
);
router.patch(
  "/email",
  inputChangeEmail,
  validateInput,
  verifyToken,
  checkUserVerification,
  profileController.changeEmail
);
router.patch(
  "/verify/:tokenEmail",
  verifyToken,
  profileController.verifyByEmail
);
router.patch(
  "/phone",
  inputChangePhone,
  validateInput,
  verifyToken,
  checkUserVerification,
  profileController.changePhone
);
router.post(
  "/avatar",
  inputChangeAvatar,
  validateInput,
  verifyToken,
  checkUserVerification,
  multerUpload.single("avatar"),
  profileController.changeAvatar
);

module.exports = router;
