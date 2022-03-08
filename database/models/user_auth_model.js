const db = require("../dbConfig");
module.exports = { insert, findByUsername, findByEmail };

function insert(user) {
  return db("users").insert(user).returning("*");
}

function findByUsername(username) {
  return db("users").where("username", username);
}

function findByEmail(email) {
  return db("users").where("email", email);
}
