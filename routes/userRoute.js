const express = require("express");
const router = express.Router();
const UserModel = require("../database/models/user_model");
const upload = require("../helpers/multer");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getUserById = await UserModel.findById(id);
    res.json(getUserById[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:id", upload.single("userAvatar"), async (req, res) => {
  try {
    const { id } = req.params;
    const changes = {
      username: req.body.username,
      userAvatar: req.file.location,
    };
    const updateUser = await UserModel.update(id, changes);
    res.json(updateUser[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
