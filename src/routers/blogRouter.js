const router = require("express").Router();
const { blogController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.post(
  "/new",
  verifyToken,
  checkUserVerification,
  multerUpload.single("blogImage"),
  blogController.createBlog
);
router.get("/all", blogController.getBlog);

module.exports = router;
