const db = require("../dbConfig");
module.exports = { find, findById, insert };

function find() {
  return db("messages").orderBy("id", "asc");
}

function findById(roomId) {
  return db("messages")
    .join("users", "messages.sentById", "=", "users.userId")
    .select(
      "messages.id",
      "users.userAvatar",
      "users.username",
      "messages.message",
      "messages.sentById",
      "messages.roomId"
    )
    .where("roomId", roomId)
    .orderBy("id", "asc");
}

function insert(message) {
  return db("messages").insert(message).returning("*");
}
