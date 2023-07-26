const db = require("../models");
const User = db.User;
const fs = require("fs");
const { profileService } = require("../service");

const ProfileController = {
  changeUsername: async (req, res) => {
    try {
      currentUsername = req.body.currentUsername;
      newUsername = req.body.newUsername;
      const errorChangeUsername = await profileService.updateProfileItem(
        req,
        res,
        "username",
        currentUsername,
        newUsername,
        "Username"
      );
      if (errorChangeUsername) {
        return res.status(errorChangeUsername.statusCode).json({
          error: "Change Username Failed",
          message: errorChangeUsername.message,
        });
      }
      return res.status(200).json({
        success: "Username updated",
        username: newUsername,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Change Username Failed",
        message: err.message,
      });
    }
  },

  changeEmail: async (req, res) => {
    try {
      currentEmail = req.body.currentEmail;
      newEmail = req.body.newEmail;
      const errorChangeEmail = await profileService.updateProfileItem(
        req,
        res,
        "email",
        currentEmail,
        newEmail,
        "Email"
      );
      if (errorChangeEmail) {
        return res.status(errorChangeEmail.statusCode).json({
          error: "Change Email Failed",
          message: errorChangeEmail.message,
        });
      }
      return res.status(200).json({
        success: "Please verify new email",
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Change Email Failed",
        message: err.message,
      });
    }
  },

  verifyByEmail: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { oldEmail, newEmail } = req.dataToken;
        console.log(req.dataToken);
        console.log(oldEmail);
        const data = await User.findOne({ where: { email: oldEmail } });

        if (!data) {
          return res.status(400).json({
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
          email: newEmail,
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
      currentPhone = req.body.currentPhone;
      newPhone = req.body.newPhone;
      const errorChangePhone = await profileService.updateProfileItem(
        req,
        res,
        "phone",
        currentPhone,
        newPhone,
        "Phone"
      );
      if (errorChangePhone) {
        return res.status(errorChangePhone.statusCode).json({
          error: "Change Phone Failed",
          message: errorChangePhone.message,
        });
      }
      return res.status(200).json({
        success: "Phone Updated",
        phone: newPhone,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Change Phone Failed",
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
