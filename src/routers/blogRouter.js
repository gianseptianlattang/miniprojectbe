const router = require("express").Router();
const { blogController } = require("../controllers");
const { verifyToken, checkUserVerification } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const { inputCreateBlog, validateInput } = require("../middleware/validator");

router.post(
  "/new",
  inputCreateBlog,
  validateInput,
  verifyToken,
  checkUserVerification,
  multerUpload.single("blogImage"),
  blogController.createBlog
);
router.get("/all", blogController.getBlog);
router.get("/all/:blogId", blogController.getBlogById);

module.exports = router;
