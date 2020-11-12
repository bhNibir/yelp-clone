const { Pool, Client } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect()

// const db = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'yelp',
//   password: process.env.DATABASE_PASSWORD,
//   port: 5432
// })

module.exports = client
