const db = require("../models");
const User = db.User;
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../helpers/sendEmail");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const updateProfileItem = async (
  req,
  res,
  itemField,
  currentValue,
  newValue,
  itemType
) => {
  return await db.sequelize.transaction(async (t) => {
    const { id, username, email, phone } = req.user;

    const isCurrentItemExist = await User.findOne({
      where: { [itemField]: currentValue },
    });

    if (
      itemField === "username" &&
      (username !== currentValue || !isCurrentItemExist)
    ) {
      return {
        statusCode: 400,
        message: "Wrong token or current username",
      };
    } else if (
      itemField === "email" &&
      (email !== currentValue || !isCurrentItemExist)
    ) {
      return {
        statusCode: 400,
        message: "Wrong token or current email",
      };
    } else if (
      itemField === "phone" &&
      (phone !== currentValue || !isCurrentItemExist)
    ) {
      return {
        statusCode: 400,
        message: "Wrong token or current phone",
      };
    }

    const isNewItemExist = await User.findOne({
      where: { [itemField]: newValue },
    });

    if (isNewItemExist) {
      return {
        statusCode: 400,
        message: `New ${itemType} Already Exists`,
      };
    }

    if (itemField === "email") {
      const payload = {
        username,
        oldEmail: currentValue,
        newEmail: newValue,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      if (!token) {
        return {
          statusCode: 500,
          message: "Create token failed",
        };
      }
      SendEmail.verifyEmail(newValue, token);
    } else if (itemField === "username" || itemField === "phone") {
      const updateData = { [itemField]: newValue };
      const updateWhere = { id };
      await User.update(updateData, { where: updateWhere }, { transaction: t });
      SendEmail.changeUsernameEmail(email, newValue);
    }
  });
};

module.exports = { updateProfileItem };
