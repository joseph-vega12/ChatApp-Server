const express = require("express");
const router = express.Router();
const RoomModel = require("../database/models/room_model");
const MessageModel = require("../database/models/message_model");
const upload = require("../helpers/multer");

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await RoomModel.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/rooms", upload.single("avatar"), async (req, res) => {
  try {
    const { roomName } = req.body;
    const postRoom = await RoomModel.insert({
      roomName: roomName,
      roomImage: req.file.location,
    });
    res.json(postRoom[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/messages", async (req, res) => {
  try {
    const getMessages = await MessageModel.find();
    res.json(getMessages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getChat = await MessageModel.findById(id);
    res.json(getChat);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/messages", async (req, res) => {
  try {
    const postMessage = await MessageModel.insert(req.body);
    res.json(postMessage[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/latest-message", async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const updateLatestMessage = await RoomModel.update(message, roomId);
    res.json(updateLatestMessage[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
