const router = require("express").Router();
const { profileController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");

router.patch("/username", verifyToken, profileController.changeUsername);
router.patch("/email", verifyToken, profileController.changeEmail);
router.patch("/phone", verifyToken, profileController.changePhone);

module.exports = router;
