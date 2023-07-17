const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const tokenApi = req.headers.authorization;
  const { tokenEmail } = req.params;
  let token;

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

    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Token",
      error: err.message,
    });
  }
};

// const checkRole = async (req, res, next) => {
//   if (req.user) {
//     return next();
//   }
//   return res.status(401).send("unauthorized");
// };

module.exports = {
  verifyToken,
  // checkRole,
};
