const db = require("../dbConfig");
module.exports = { find, insert, update };

function find() {
  return db("rooms").orderBy("id", "asc");
}

function insert(room) {
  return db("rooms").insert(room).returning("*");
}

function update(room, id) {
  return db("rooms")
    .where("id", id)
    .update("latestMessage", room)
    .returning("*");
}
