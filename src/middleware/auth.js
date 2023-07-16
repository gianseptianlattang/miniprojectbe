const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Invalid Token",
      error: "Access Denied!",
    });
  }

  try {
    token = token.split(" ")[1];

    if (token === "null" || !token) {
      return res.status(401).json({
        message: "Invalid Token",
        error: "Access Denied!",
      });
    }

    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    if (!verifiedUser) {
      return res.status(401).json({
        message: "Invalid Token",
        error: "Unauthorized request",
      });
    }

    req.user = verifiedUser;
    // console.log(req.user);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Token",
      error: err.message,
    });
  }
};

const checkRole = async (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send("unauthorized");
};

module.exports = {
  verifyToken,
  checkRole,
};
