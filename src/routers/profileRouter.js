const router = require("express").Router();
const { profileController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.patch("/username", verifyToken, profileController.changeUsername);
router.patch("/email", verifyToken, profileController.changeEmail);
router.patch(
  "/verify/:tokenEmail",
  verifyToken,
  profileController.verifyByEmail
);
router.patch("/phone", verifyToken, profileController.changePhone);
router.post(
  "/avatar",
  verifyToken,
  multerUpload.single("avatar"),
  profileController.changeAvatar
);

module.exports = router;
