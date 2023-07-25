const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const checkRegistExistingUser = async (email, username, phone) => {
  const dataEmail = await User.findOne({ where: { email: email } });
  const dataUsername = await User.findOne({
    where: { username: username },
  });
  const dataPhone = await User.findOne({
    where: { phone: phone },
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
  if (dataPhone) {
    return {
      statusCode: 400,
      message: "Phone exist!",
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

const updatePassword = async (id, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  await db.sequelize.transaction(async (t) => {
    await User.update(
      { password: hashPassword },
      { where: { id: id } },
      { transaction: t }
    );
  });
};

const updateIsVerifiedUserTrue = async (userId) => {
  const dataUsername = await User.findOne({
    where: { id: userId },
  });

  if (dataUsername.isVerified) {
    return {
      statusCode: 400,
      message: "User is verified",
    };
  }

  await db.sequelize.transaction(async (t) => {
    await User.update(
      { isVerified: 1 },
      { where: { id: userId } },
      { transaction: t }
    );
  });
};

const updateIsVerifiedUserFalse = async (userId) => {
  const dataUsername = await User.findOne({
    where: { id: userId },
  });

  if (dataUsername.isVerified) {
    return {
      statusCode: 400,
      message: "User is verified",
    };
  }

  await db.sequelize.transaction(async (t) => {
    await User.update(
      { isVerified: 0 },
      { where: { id: userId } },
      { transaction: t }
    );
  });
};

const validatePassword = async (userId, password) => {
  const checkData = await User.findOne({
    where: { id: userId },
  });
  const isValid = await bcrypt.compare(password, checkData.password);
  if (!isValid) {
    return { statusCode: 400, message: "Current password is incorrect" };
  }
};

const checkLoginInput = async (password, dataInput) => {
  const checkLogin = await User.findOne({
    where: dataInput,
  });
  if (!checkLogin) {
    return { statusCode: 404, message: { error: "User not found", dataInput } };
  }
  const result = await validatePassword(checkLogin.id, password);
  if (result) {
    return result;
  }
};

module.exports = {
  checkRegistExistingUser,
  checkComparePassword,
  validatePassword,
  checkPasswordValidator,
  checkLoginInput,
  createUser,
  updateIsVerifiedUserTrue,
  updateIsVerifiedUserFalse,
  updatePassword,
};
