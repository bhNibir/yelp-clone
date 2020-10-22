const { Pool } = require('pg')
require('dotenv').config()

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'yelp',
  password: process.env.DATABASE_PASSWORD,
  port: 5432
})

module.exports = db
