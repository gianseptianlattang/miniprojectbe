const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const verifyToken = async (req, res, next) => {
  const tokenApi = req.headers.authorization;
  const tokenEmail = req.params.tokenEmail;
  // const token = tokenApi.split(" ")[1];
  let dataUser;

  if (tokenApi) {
    token = tokenApi.split(" ")[1];
  } else if (tokenEmail) {
    token = tokenEmail;
  } else {
    return res.status(401).json({
      message: "Access Denied!",
      error: "Please check your token",
    });
  }

  try {
    if (token === "null" || !token) {
      return res.status(401).json({
        message: "Access Denied!",
        error: "Token null or undefined",
      });
    }

    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    if (!verifiedUser) {
      return res.status(401).json({
        message: "Invalid Token",
        error: "Unauthorized request",
      });
    }
    if (!verifiedUser.username) {
      dataUser = await User.findOne({
        where: { email: verifiedUser.email },
      });
    } else {
      dataUser = await User.findOne({
        where: { username: verifiedUser.username },
      });
    }

    if (!dataUser) {
      return res.status(401).json({
        message: "Invalid Token",
        error: "User not registered",
      });
    }

    req.user = dataUser;
    req.token = token;
    req.dataToken = verifiedUser;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Token",
      error: err.message,
    });
  }
};

const checkUserVerification = async (req, res, next) => {
  //check user verification data
  const { isVerified } = req.user;
  if (!isVerified) {
    return res.status(404).json({
      message: "Verification failed",
      error: "User not verified",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  checkUserVerification,
};
