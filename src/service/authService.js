const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const checkRegistExistingUsernameEmail = async (email, username) => {
  const dataEmail = await User.findOne({ where: { email: email } });
  const dataUsername = await User.findOne({
    where: { username: username },
  });
  if (dataUsername) {
    return {
      statusCode: 400,
      message: "Username exist!",
    };
  }
  if (dataEmail) {
    return {
      statusCode: 400,
      message: "Email exist!",
    };
  }
};

const checkComparePassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      statusCode: 400,
      message: "Password and confirm password is not match",
    };
  }
};

const checkPasswordValidator = (password) => {
  var schema = new passwordValidator();
  schema
    .is()
    .min(6, "Password must have minimum 6 character")
    .has()
    .uppercase(1, "Password must have minimum 1 uppercase")
    .has()
    .symbols(1, "Password must have minimum 1 symbol");

  if (!schema.validate(password)) {
    return {
      statusCode: 400,
      message: schema.validate(password, { details: true })[0].message,
    };
  }
};

const createUser = async (username, email, phone, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const dataUser = await db.sequelize.transaction(async (t) => {
    return User.create(
      {
        username,
        email,
        phone,
        password: hashPassword,
      },
      { transaction: t }
    );
  });
  return dataUser;
};

const checkLoginInput = async () => {
  let dataInput = {};
  //get data login
  if (username) {
    dataInput = { username: username };
  } else if (email) {
    dataInput = { email: email };
  } else if (phone) {
    dataInput = { phone: phone };
  } else {
    return res.status(500).json({
      message: "Login failed",
      error: "Invalid input",
    });
  }

  //get data from DB
  const checkLogin = await User.findOne({
    where: dataInput,
  });
};

const checkPassword = async (bodyPassword, dbPassword) => {
  const isValid = await bcrypt.compare(bodyPassword, dbPassword);
  if (!isValid) {
    return res.status(404).json({
      message: "Login failed",
      error: "Password is incorrect",
    });
  }
};

module.exports = {
  checkRegistExistingUsernameEmail,
  checkComparePassword,
  checkPasswordValidator,
  checkLoginInput,
  checkPassword,
  createUser,
};
