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
    const rooms = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
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

router.get("/messages", async (req, res) => {
  try {
    const getMessages = await pool.query(
      "SELECT * FROM messages ORDER BY id ASC"
    );
    res.json(getMessages.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getChat = await pool.query(
      "SELECT messages.id, users.useravatar, users.username, messages.message, messages.sentbyid, messages.roomid FROM messages INNER JOIN users ON users.userid = messages.sentbyid WHERE roomid = ($1)",
      [id]
    );
    res.json(getChat.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { roomid, sentbyid, message } = req.body;
    const postToChat = await pool.query(
      "INSERT INTO messages (roomId, sentbyid, message) Values($1, $2, $3) RETURNING *",
      [roomid, sentbyid, message]
    );
    res.json(postToChat.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/latest-message", async (req, res) => {
  try {
    const { roomid, message } = req.body;
    const updateLatestMessage = await pool.query(
      "UPDATE rooms SET latestmessage = ($1) WHERE id = ($2) RETURNING *",
      [message, roomid]
    );
    res.json(updateLatestMessage.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
