const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const RegisterUser = await pool.query(
    "INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *",
    [email, username, password]
  );
  res.json(RegisterUser.rows[0]);
});

module.exports = router;
