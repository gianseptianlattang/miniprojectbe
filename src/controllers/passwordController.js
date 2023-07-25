const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../helpers/sendEmail");
const { authService, tokenService } = require("../service");

const PasswordController = {
  changePassword: async (req, res) => {
    try {
      const { currentPassword, password, confirmPassword } = req.body;
      const { id } = req.user;
      const errorValidatePassword = await authService.validatePassword(
        id,
        currentPassword
      );
      const errorPasswordValidation =
        authService.checkPasswordValidator(password);
      const errorComparePassword = authService.checkComparePassword(
        password,
        confirmPassword
      );
      const registrationError =
        errorValidatePassword ||
        errorPasswordValidation ||
        errorComparePassword;
      if (registrationError) {
        return res.status(registrationError.statusCode).json({
          error: "Change Password Failed",
          message: registrationError.message,
        });
      }
      await authService.updatePassword(id, password);
      return res.status(200).json({
        success: "Change Password Succeed",
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
      const token = tokenService.createToken(payload);
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
      const { id } = req.user;
      const errorPasswordValidation =
        authService.checkPasswordValidator(password);
      const errorComparePassword = authService.checkComparePassword(
        password,
        confirmPassword
      );
      const registrationError = errorPasswordValidation || errorComparePassword;
      if (registrationError) {
        return res.status(registrationError.statusCode).json({
          error: "Reset Password Failed",
          message: registrationError.message,
        });
      }
      await authService.updatePassword(id, password);
      return res.status(200).json({
        success: "Reset Password Succeed",
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Reset Password Failed",
        message: err.message,
      });
    }
  },
};

module.exports = PasswordController;
