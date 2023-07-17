const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SendEmail = require("../mail/sendEmail");

const AuthController = {
  userRegistration: async (req, res) => {
    try {
      const { username, email, phone, password, confirmPassword } = req.body;

      //check confirm password
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Registration Failed",
          error: "password and confirm Password is not match",
        });
      }
      //password validation
      var schema = new passwordValidator();
      schema
        .is()
        .min(6, "password must have minimum 6 character")
        .has()
        .uppercase(1, "password must have minimum 1 uppercase")
        .has()
        .symbols(1, "password must have minimum 1 symbol");

      if (!schema.validate(password)) {
        return res.status(400).json({
          message: "Registration Failed",
          error: schema.validate(password, { details: true })[0].message,
        });
      }

      //password encrypt and transaction
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        const data = await User.create(
          {
            username,
            email,
            phone,
            password: hashPassword,
          },
          { transaction: t }
        );

        //create token
        let payload = {
          username: username,
          email: email,
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        if (!token) {
          return res.status(500).json({
            message: "Registration Failed",
            error: "get token failed",
          });
        }

        SendEmail.verifyEmail(email, token);

        return res.status(200).json({
          message: "Registration Succeed",
          data,
          token,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Registration Failed",
        error: err.errors[0].message,
      });
    }
  },

  userVerify: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { username } = req.user;
        await User.update(
          { isVerified: 1 },
          { where: { username: username } },
          { transaction: t }
        );
        return res.status(200).json({
          message: "Verification Succeed",
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Verification Failed",
        error: err.message,
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      let dataInput = {};
      const { username, email, phone, password } = req.body;

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

      //data validation
      if (!checkLogin) {
        return res.status(404).json({
          message: "Login failed",
          error: "user not found",
          dataInput,
        });
      }

      //check user verification data
      if (!checkLogin.isVerified) {
        return res.status(404).json({
          message: "Login failed",
          error: "User not verified",
          dataInput,
        });
      }

      const isValid = await bcrypt.compare(password, checkLogin.password);
      if (!isValid) {
        return res.status(404).json({
          message: "Login failed",
          error: "Password is incorrect",
        });
      }

      //create token
      let payload = {
        id: checkLogin.id,
        username: checkLogin.username,
        email: checkLogin.email,
        phone: checkLogin.phone,
        isAdmin: checkLogin.isAdmin,
        isVerified: checkLogin.isVerified,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });

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
