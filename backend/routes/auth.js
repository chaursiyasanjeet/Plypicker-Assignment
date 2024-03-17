const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyAuth = require("../middelware/verifyAuth");

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, admin } = req.body;

    //if anything is empty
    if (!name || !email || !password) {
      res.status(400).json({
        status: "FAILED",
        message: "Epmty fields",
      });
      return;
    }

    //checking if already exist
    const existingEmail = await User.findOne({ email });

    //if user already exist
    if (existingEmail) {
      res.status(409).json({
        status: "FAILED",
        message: "user already exist",
      });
      return;
    }

    //encrypting the password
    const encryptedPasswd = await bcrypt.hash(password, 10);

    //creating user
    const user = new User({
      name,
      email,
      password: encryptedPasswd,
      admin,
    });
    await user.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "User registered successfully",
    });
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({
        status: "FAILED",
        message: "Empty Fields",
      });
      return;
    }

    //checking for user exist
    const userExist = await User.findOne({ email });

    //if use not found
    if (!userExist) {
      res.status(404).json({
        status: "FAILED",
        message: "user not exist,Please Register First",
      });
      return;
    }
    //if user found

    const passwdMatched = await bcrypt.compare(password, userExist.password);

    if (!passwdMatched) {
      res.status(401).json({
        status: "FAILED",
        message: "wrong password",
      });
      return;
    }

    const jwtToken = jwt.sign(userExist.toJSON(), process.env.JWT_SECRET);

    res.status(200).json({
      status: "SUCCESS",
      message: `${userExist.name} signed in successfully`,
      admin: userExist.admin,
      jwtToken,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/verifyUserJWT", verifyAuth, async (req, res, next) => {
  try {
    res.status(200).json({
      status: "SUCCESS",
      admin: req.userExist.admin,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
