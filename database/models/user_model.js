const db = require("../dbConfig");
module.exports = { findById, updateUserAvatar, updateUserDetails };

function findById(id) {
  return db("users")
    .select("userId", "userAvatar", "username", "email")
    .where("userId", id);
}

function updateUserAvatar(id, image) {
  return db("users")
    .update("userAvatar", image)
    .where("userId", id)
    .returning("*");
}

function updateUserDetails(id, changes) {
  return db("users").update(changes).where("userId", id).returning("*");
}
