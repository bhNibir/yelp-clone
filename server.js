const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Create Server Instance
const app = express()

// Environmental Variables
const PORT = process.env.PORT

app.use(express.static(path.join(__dirname, 'frontend', 'build')))

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/query', require('./routes/queryRouter'))
app.use('/api/restaurants', require('./routes/restaurantRouter'))
app.use('/api/ratings', require('./routes/ratingsRouter'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
