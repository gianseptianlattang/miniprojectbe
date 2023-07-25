const db = require("../models");
const User = db.User;

const SendEmail = require("../helpers/sendEmail");
const { authService, tokenService } = require("../service");

const AuthController = {
  userRegistration: async (req, res) => {
    try {
      const { username, email, phone, password, confirmPassword } = req.body;
      const errorInput = await authService.checkRegistExistingUser(
        email,
        username,
        phone
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
      const { id } = req.user;
      const dataUpdateUser = await authService.updateIsVerifiedUserTrue(id);
      if (dataUpdateUser) {
        return res.status(dataUpdateUser.statusCode).json({
          error: "Verification Failed",
          message: dataUpdateUser.message,
        });
      }
      return res.status(200).json({
        success: "Verification Succeed",
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
      let dataInput = {};
      if (username) {
        dataInput = { username: username };
      } else if (email) {
        dataInput = { email: email };
      } else if (phone) {
        dataInput = { phone: phone };
      } else {
        return {
          statusCode: 500,
          message: "Invalid input",
        };
      }
      const errorCheckLogin = await authService.checkLoginInput(
        password,
        dataInput
      );
      if (errorCheckLogin) {
        return res.status(errorCheckLogin.statusCode).json({
          error: "Login failed",
          message: errorCheckLogin.message,
        });
      }
      const checkLogin = await User.findOne({
        where: dataInput,
      });
      let payload = {
        id: checkLogin.id,
        username: checkLogin.username,
        email: checkLogin.email,
        phone: checkLogin.phone,
        isAdmin: checkLogin.isAdmin,
        isVerified: checkLogin.isVerified,
      };
      const token = tokenService.createToken(payload);
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
};

module.exports = AuthController;
