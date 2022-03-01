const express = require("express");
const router = express.Router();
const UserAuthModel = require("../models/user_auth_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkUsernameIfExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await UserAuthModel.findByUsername(username);
    if (user.length >= 1) {
      req.userData = user[0];
      next();
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const makeJwtToken = (user) => {
  const payload = {
    id: user.userId,
    avatar: user.userAvatar,
    username: user.username,
  };
  const option = {
    expiresIn: "2 hours",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, option);
};

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const registerUser = await UserAuthModel.insert({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    const token = makeJwtToken(registerUser[0]);
    res.send({ token: token });
  } catch (error) {
    res.send({ message: error.message });
  }
});

router.post("/login", checkUsernameIfExists, async (req, res) => {
  try {
    const verifies = bcrypt.compareSync(
      req.body.password,
      req.userData.password
    );
    if (verifies) {
      const token = makeJwtToken(req.userData);
      res.send({ token: token });
    } else {
      res.status(401).json("bad credentials");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
