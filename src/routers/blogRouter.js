const router = require("express").Router();
const { blogController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.post(
  "/new",
  verifyToken,
  multerUpload.single("blogImage"),
  blogController.createBlog
);
router.get("/all", blogController.getBlog);

module.exports = router;
