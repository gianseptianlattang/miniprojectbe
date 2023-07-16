const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

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
          expiresIn: "1m",
        });
        if (!token) {
          return res.status(500).json({
            message: "Registration Failed",
            error: "get token failed",
          });
        }

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
};

module.exports = AuthController;
