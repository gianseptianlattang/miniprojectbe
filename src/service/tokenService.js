const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { createToken };
