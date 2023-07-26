const db = require("../models");
const User = db.User;
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../helpers/sendEmail");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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
            error: "Invalid Username",
            message: "Wrong token or current username",
          });
        }
        const isUserExist = await User.findOne({
          where: {
            username: newUsername,
          },
        });
        if (isUserExist) {
          return res.status(400).json({
            error: "Invalid Username",
            message: "New Username Already Exist",
          });
        }
        await User.update(
          { username: newUsername },
          { where: { username: username } },
          { transaction: t }
        );
        SendEmail.changeUsernameEmail(email, newUsername, "Username");
        return res.status(200).json({
          success: "Username updated",
          username: newUsername,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Update Failed",
        message: err.message,
      });
    }
  },

  changeEmail: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { username, email } = req.user;
        const { currentEmail, newEmail } = req.body;
        const isCurrentEmailExist = await User.findOne({
          where: {
            email: currentEmail,
          },
        });
        if (email !== currentEmail || !isCurrentEmailExist) {
          return res.status(400).json({
            error: "Invalid Email",
            message: "Wrong token or current email",
          });
        }
        const isEmailExist = await User.findOne({
          where: {
            email: newEmail,
          },
        });
        if (isEmailExist) {
          return res.status(400).json({
            error: "Invalid Email",
            message: "New Email Already Exist",
          });
        }
        let payload = {
          username: username,
          oldEmail: currentEmail,
          newEmail: newEmail,
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        if (!token) {
          return res.status(500).json({
            error: "Registration Failed",
            message: "create token failed",
          });
        }

        SendEmail.verifyEmail(newEmail, token);
        return res.status(200).json({
          success: "Please verify new email",
          token,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Update Email Failed",
        message: err.message,
      });
    }
  },

  verifyByEmail: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { oldEmail, newEmail } = req.dataToken;
        const data = await User.findOne({ where: { email: oldEmail } });

        if (!data) {
          return res.status(err.statusCode || 400).json({
            error: "Update Email Failed",
            message: "Wrong current email",
          });
        }
        await User.update(
          { email: newEmail },
          { where: { email: oldEmail } },
          { transaction: t }
        );

        return res.status(200).json({
          success: "Email updated",
          message: newEmail,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Update Email Failed",
        message: err.message,
      });
    }
  },

  changePhone: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { id, phone, email } = req.user;
        const { currentPhone, newPhone } = req.body;
        const isCurrentPhoneExist = await User.findOne({
          where: {
            phone: currentPhone,
          },
        });
        if (phone !== currentPhone || !isCurrentPhoneExist) {
          return res.status(400).json({
            error: "Invalid Phone",
            message: "Wrong token or current phone",
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
          { where: { id: id } },
          { transaction: t }
        );
        SendEmail.changeUsernameEmail(email, newPhone, "Phone");
        return res.status(200).json({
          success: "Phone updated",
          message: newPhone,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Update Failed",
        message: err.message,
      });
    }
  },

  changeAvatar: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Change avatar failed",
          message: "avatar cannot be empty!",
        });
      }
      const { id } = req.user;
      await db.sequelize.transaction(async (t) => {
        const oldData = await User.findOne({ where: { id } });
        const result = await User.update(
          {
            profileImg: req.file.path,
          },
          { where: { id } },
          { transaction: t }
        );
        if (!result) {
          return res.status(500).json({
            message: "Change avatar failed",
            error: err.message,
          });
        }
        fs.unlink(oldData.profileImg, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Previous avatar deleted successfully");
        });
        return res.status(200).json({
          success: "Change avatar Success",
          image: req.file.path,
        });
      });
    } catch (err) {
      return res.status(500).json({
        error: "Change avatar failed",
        message: err.message,
      });
    }
  },
};

module.exports = ProfileController;
