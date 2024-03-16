const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;

    //if anything is empty
    if (!name || !email || !admin || !password) {
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
    res.json({
      status: "SUCCESS",
      message: "User registered successfully",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "FAILED", message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
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
      res.status(500).json({
        status: "FAILED",
        message: "user not exist,Please Register First",
      });
      return;
    }
    //if user found

    const passwdMatched = await bcrypt.compare(password, userExist.password);

    if (!passwdMatched) {
      res.status(500).json({
        status: "FAILED",
        message: "wrong password",
      });
      return;
    }

    const jwtToken = jwt.sign(userExist.toJSON(), process.env.JWT_SECRET);

    res.json({
      status: "SUCCESS",
      message: `${userExist.name} signed in successfully`,
      admin: userExist.admin,
      jwtToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "FAILED", message: "Server error" });
  }
});

module.exports = router;