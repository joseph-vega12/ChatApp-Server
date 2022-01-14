const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.HOST,
  port: process.env.PORT,
});

module.exports = pool;
