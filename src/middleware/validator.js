const { body, validationResult } = require("express-validator");

const inputRegistration = [
  body("username").notEmpty().withMessage("Username cannot be empty!"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  body("password").notEmpty().withMessage("Password cannot be empty!"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password cannot be empty!"),
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
};
