const { body, validationResult, header } = require("express-validator");

const inputRegistration = [
  body("username").notEmpty().withMessage("username cannot be empty!"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("phone").isMobilePhone().withMessage("Invalid phone format"),
  body("password").notEmpty().withMessage("password cannot be empty!"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword cannot be empty!"),
];

const inputVerifyUser = [
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputLogin = [
  body("password").notEmpty().withMessage("password cannot be empty!"),
];

const inputForgotPassword = [
  body("email").isEmail().withMessage("Invalid email format"),
];

const inputResetPassword = [
  body("password").notEmpty().withMessage("password cannot be empty!"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword cannot be empty!"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("currentPassword cannot be empty!"),
  body("password").notEmpty().withMessage("password cannot be empty!"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword cannot be empty!"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputChangeUsername = [
  body("currentUsername")
    .notEmpty()
    .withMessage("currentUsername cannot be empty!"),
  body("newUsername").notEmpty().withMessage("newUsername cannot be empty!"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputChangeEmail = [
  body("currentEmail").isEmail().withMessage("Invalid currentEmail format"),
  body("newEmail").isEmail().withMessage("Invalid email format"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputChangePhone = [
  body("currentPhone")
    .isMobilePhone()
    .withMessage("Invalid currentPhone format"),
  body("newPhone").isMobilePhone().withMessage("Invalid newPhone format"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const inputChangeAvatar = [
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];
const inputCreateBlog = [
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization cannot be empty!"),
];

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateInput,
  inputRegistration,
  inputVerifyUser,
  inputLogin,
  inputForgotPassword,
  inputResetPassword,
  inputChangePassword,
  inputChangeUsername,
  inputChangeEmail,
  inputChangePhone,
  inputChangeAvatar,
  inputCreateBlog,
};
