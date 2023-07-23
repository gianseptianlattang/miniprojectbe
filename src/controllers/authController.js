const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../helpers/sendEmail");
const { authService, tokenService } = require("../service");

const AuthController = {
  userRegistration: async (req, res) => {
    try {
      const { username, email, phone, password, confirmPassword } = req.body;
      const errorInput = await authService.checkRegistExistingUsernameEmail(
        email,
        username
      );
      const errorPasswordValidator =
        authService.checkPasswordValidator(password);
      const errorComparePassword = authService.checkComparePassword(
        password,
        confirmPassword
      );

      const registrationError =
        errorInput || errorPasswordValidator || errorComparePassword;
      if (registrationError) {
        return res.status(registrationError.statusCode).json({
          error: "Registration Failed",
          message: registrationError.message,
        });
      }

      const payload = {
        username: username,
        email: email,
        phone: phone,
      };
      const token = tokenService.createToken(payload);

      const data = await authService.createUser(
        username,
        email,
        phone,
        password
      );

      SendEmail.verifyEmail(email, token);

      return res.status(200).json({
        success: "Registration Succeed",
        message: "Please verify your account from email",
        data,
        token,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Registration Failed",
        message: err.message,
      });
    }
  },

  userVerify: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { id } = req.user;
        await User.update(
          { isVerified: 1 },
          { where: { id: id } },
          { transaction: t }
        );
        return res.status(200).json({
          success: "Verification Succeed",
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Verification Failed",
        message: err.message,
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      //checkLoginInput
      //data validation
      if (!checkLogin) {
        return res.status(404).json({
          message: "Login failed",
          error: "User not found",
          dataInput,
        });
      }
      //checkPassword
      //create token
      let payload = {
        id: checkLogin.id,
        username: checkLogin.username,
        email: checkLogin.email,
        phone: checkLogin.phone,
        isAdmin: checkLogin.isAdmin,
        isVerified: checkLogin.isVerified,
      };
      // createToken(payload);
      return res.status(200).json({
        message: "Login succeed",
        data: payload,
        token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, password, confirmPassword } = req.body;
      const { id } = req.user;

      const checkData = await User.findOne({
        where: {
          id: id,
        },
      });

      //check current password

      //check Compare password
      // if (password !== confirmPassword)

      //password validation
      // var schema = new passwordValidator();

      //password encrypt and transaction
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        await User.update(
          { password: hashPassword },
          { where: { id: id } },
          { transaction: t }
        );

        return res.status(200).json({
          message: "Change Password Succeed",
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Change Password Failed",
        error: err.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      let payload = {
        email: email,
      };
      // createToken(payload);

      SendEmail.verifyEmail(email, token);
      return res.status(200).json({
        message: "Reset Password Succeed, Please verify from email!",
        token,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Reset Password Failed",
        error: err.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password, confirmPassword } = req.body;

      //check COmpare password
      // if (password !== confirmPassword)

      //password validation
      // var schema = new passwordValidator();

      const { username } = req.user;
      const data = await User.findOne({ where: { username: username } });

      if (!data) {
        return res.status(err.statusCode || 400).json({
          message: "Reset Password Failed",
          error: "Wrong token",
        });
      }

      //password encrypt and transaction
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        await User.update(
          { password: hashPassword },
          { where: { username: username } },
          { transaction: t }
        );

        return res.status(200).json({
          message: "Reset Password Succeed",
          data,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Reset Password Failed",
        error: err.message,
      });
    }
  },
};

module.exports = AuthController;
