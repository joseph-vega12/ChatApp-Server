const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getUser = await pool.query(
      "SELECT users.userid, users.useravatar, users.username, users.email FROM users WHERE userid = ($1)",
      [id]
    );
    res.json(getUser.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:id", upload.single("userAvatar"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = await pool.query(
      "UPDATE users SET useravatar = ($1) WHERE userid = ($2) RETURNING *",
      [req.file.path, id]
    );
    res.json(updateUser.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
