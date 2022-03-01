const db = require("../db");

module.exports = { findById, update };

function findById(id) {
  return db("users")
    .select("userId", "userAvatar", "username", "email")
    .where("userId", id);
}

function update(id, changes) {
  return db("users")
    .update("userAvatar", changes)
    .where("userId", id)
    .returning("*");
}
