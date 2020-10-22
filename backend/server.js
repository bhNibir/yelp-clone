const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Create Server Instance
const app = express()

// Environmental Variables
const PORT = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/restaurants', require('./routes/restaurantRouter'))
app.use('/ratings', require('./routes/ratingsRouter'))

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
