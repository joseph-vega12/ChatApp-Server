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

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await pool.query("SELECT * FROM rooms");
    res.json(rooms.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/rooms", upload.single("avatar"), async (req, res) => {
  try {
    const { roomName } = req.body;
    const postRoom = await pool.query(
      "INSERT INTO rooms (roomName, roomImage) VALUES($1, $2) RETURNING *",
      [roomName, req.file.path]
    );
    res.json(postRoom.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

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
