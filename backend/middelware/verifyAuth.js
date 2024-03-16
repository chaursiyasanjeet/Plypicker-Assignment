const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const verifyAuth = (req, res, next) => {
  try {
    const jwtToken = req.headers.token;
    const user = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userExist = user;
    next();
  } catch (error) {
    console.log(error);
    next(new Error("Please login first"));
  }
};

module.exports = verifyAuth;
