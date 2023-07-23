const router = require("express").Router();
const { profileController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.patch(
  "/username",
  verifyToken,
  checkUserVerification,
  profileController.changeUsername
);
router.patch(
  "/email",
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
  verifyToken,
  checkUserVerification,
  profileController.changePhone
);
router.post(
  "/avatar",
  verifyToken,
  checkUserVerification,
  multerUpload.single("avatar"),
  profileController.changeAvatar
);

module.exports = router;
