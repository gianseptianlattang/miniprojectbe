const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");

const AuthController = {
  userRegistration: async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    try {
      const data = await User.create({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcrypt.hash(req.body.password, salt),
      });
      return res.status(200).json({
        data,
        message: "Register success",
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = AuthController;
