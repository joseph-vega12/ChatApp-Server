const express = require("express");
const router = express.Router();
const pool = require("../db");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");

const checkUsernameIfExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE username = ($1)", [
      username,
    ]);
    if (user.rows.length >= 1) {
      req.userData = user.rows[0];
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
    id: user.userid,
    username: user.username,
  };
  const option = {
    expiresIn: "2 hours",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, option);
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = bycrpt.hashSync(password, 10);
    const RegisterUser = await pool.query(
      "INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *",
      [email, username, hashedPassword]
    );
    res.json(RegisterUser.rows[0]);
  } catch (error) {
    res.send({ message: error });
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
