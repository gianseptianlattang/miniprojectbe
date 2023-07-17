const db = require("../models");
const User = db.User;
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../mail/sendEmail");

const ProfileController = {
  changeUsername: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { username, email } = req.user;
        const { currentUsername, newUsername } = req.body;

        const isCurrentUsernameExist = await User.findOne({
          where: {
            username: currentUsername,
          },
        });
        if (username !== currentUsername || !isCurrentUsernameExist) {
          return res.status(400).json({
            message: "Invalid Username",
            error: "Wrong token or current username",
          });
        }

        const isUserExist = await User.findOne({
          where: {
            username: newUsername,
          },
        });
        if (isUserExist) {
          return res.status(400).json({
            message: "Invalid Username",
            error: "New Username Already Exist",
          });
        }

        await User.update(
          { username: newUsername },
          { where: { username: username } },
          { transaction: t }
        );
        SendEmail.changeUsernameEmail(email, "Username");
        return res.status(200).json({
          message: "Username updated",
          username: newUsername,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Update Failed",
        error: err.message,
      });
    }
  },

  changeEmail: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { email } = req.user;
        const token = req.token;
        const { currentEmail, newEmail } = req.body;

        const isCurrentEmailExist = await User.findOne({
          where: {
            email: currentEmail,
          },
        });
        if (email !== currentEmail || !isCurrentEmailExist) {
          return res.status(400).json({
            message: "Invalid Email",
            error: "Wrong token or current email",
          });
        }

        const isEmailExist = await User.findOne({
          where: {
            email: newEmail,
          },
        });
        if (isEmailExist) {
          return res.status(400).json({
            message: "Invalid Email",
            error: "New Email Already Exist",
          });
        }

        await User.update(
          { email: newEmail },
          { where: { email: email } },
          { transaction: t }
        );
        SendEmail.verifyEmail(newEmail, token);
        return res.status(200).json({
          message: "Email updated",
          email: newEmail,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Update Failed",
        error: err.message,
      });
    }
  },

  changePhone: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { phone, email } = req.user;
        const { currentPhone, newPhone } = req.body;

        const isCurrentPhoneExist = await User.findOne({
          where: {
            phone: currentPhone,
          },
        });
        if (phone !== currentPhone || !isCurrentPhoneExist) {
          return res.status(400).json({
            message: "Invalid Phone",
            error: "Wrong token or current phone",
          });
        }

        const isNewPhoneExist = await User.findOne({
          where: {
            phone: newPhone,
          },
        });
        if (isNewPhoneExist) {
          return res.status(400).json({
            message: "Invalid Phone",
            error: "New Phone Already Exist",
          });
        }

        await User.update(
          { phone: newPhone },
          { where: { phone: phone } },
          { transaction: t }
        );
        SendEmail.changeUsernameEmail(email, "Phone");
        return res.status(200).json({
          message: "Phone updated",
          phone: newPhone,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Update Failed",
        error: err.message,
      });
    }
  },
};

module.exports = ProfileController;
