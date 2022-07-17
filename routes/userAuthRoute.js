const express = require("express");
const router = express.Router();
const UserAuthModel = require("../database/models/user_auth_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkAllFieldsOnRegister = (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username) {
    res.status(400).json({ message: "Username Field is required" });
  } else if (!password) {
    res.status(400).json({ message: "Password Field is required" });
  } else if (!email) {
    res.status(400).json({ message: "Email Field is required" });
  } else {
    next();
  }
};

const checkAllFieldsOnLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({ message: "Username Field is required" });
  } else if (!password) {
    res.status(400).json({ message: "Password Field is required" });
  } else {
    next();
  }
};

const checkUsernameIfExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const User = await UserAuthModel.findByUsername(username);
    if (User.length >= 1) {
      req.userData = User[0];
      next();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkUsernameIsUnique = async (req, res, next) => {
  try {
    const { username } = req.body;
    const User = await UserAuthModel.findByUsername(username.toLowerCase());
    if (!User.length) {
      next();
    } else {
      res.status(409).json({ message: "Username is already taken." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkEmailIsUnique = async (req, res, next) => {
  try {
    const { email } = req.body;
    const Email = await UserAuthModel.findByEmail(email.toLowerCase());
    if (!Email.length) {
      next();
    } else {
      res.status(409).json({ message: "Email is already taken." });
    }
  } catch (error) {
    res.status(500).json(error);
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

router.post(
  "/register",
  checkAllFieldsOnRegister,
  checkUsernameIsUnique,
  checkEmailIsUnique,
  async (req, res) => {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const registerUser = await UserAuthModel.insert({
        username: req.body.username.toLowerCase(),
        password: hashedPassword,
        email: req.body.email.toLowerCase(),
      });
      const token = makeJwtToken(registerUser[0]);
      res.send({ token: token });
    } catch (error) {
      res.send({ message: error.message });
    }
  }
);

router.post(
  "/login",
  checkAllFieldsOnLogin,
  checkUsernameIfExists,
  async (req, res) => {
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
  }
);

module.exports = router;
