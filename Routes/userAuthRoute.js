const express = require("express");
const router = express.Router();
const pool = require("../db");
const bycrpt = require("bcryptjs");

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


module.exports = router;
