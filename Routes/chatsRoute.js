const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getChat = await pool.query(
      "SELECT * FROM messages WHERE roomId = ($1)",
      [id]
    );
    res.json(getChat.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { roomId, sentBy, message } = req.body;
    const postToChat = await pool.query(
      "INSERT INTO messages (roomId, sentBy, message) Values($1, $2, $3) RETURNING *",
      [roomId, sentBy, message]
    );
    res.json(postToChat.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
