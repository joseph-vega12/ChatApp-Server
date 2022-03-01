const db = require("../db");
module.exports = { insert, findByUsername };

function insert(user) {
  return db("users").insert(user).returning("*");
}

function findByUsername(username) {
  return db("users").where("username", username);
}
