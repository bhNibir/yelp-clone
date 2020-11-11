const router = require('express').Router()
const db = require('../db')
const isRestaurantIDValid = require('../middleware/isRestaurantIDValid')
const isRatingIDValid = require('../middleware/isRatingIDValid')
const validateRatingInput = require('../middleware/validateRatingInput')

// Get all ratings for a specific restaurant
router.get('/:id', isRestaurantIDValid, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ratings WHERE restaurant_id = $1 ORDER BY timestamp DESC', [req.params.id])
    const data = result.rows
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Create a new rating for restaurant
router.post('/', validateRatingInput, async (req, res) => {
  try {
    const { restaurant_id, rating, name, message } = req.body
    const result = await db.query('INSERT INTO ratings (restaurant_id, rating, name, message) VALUES ($1, $2, $3, $4) RETURNING *', [restaurant_id, rating, name, message])
    const data = result.rows[0]
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Update a rating (Remember that the id in the parameter should be the ratings id - NOT the restaurant's id)
router.put('/:id', validateRatingInput, isRatingIDValid, async (req, res) => {
  try {
    const { rating, name, message } = req.body
    const result = await db.query('UPDATE ratings SET rating = $1, name = $2, message = $3 WHERE id = $4 RETURNING *', [rating, name, message, req.params.id])
    const data = result.rows[0]
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Delete a rating
router.delete('/:id', isRatingIDValid, async (req, res) => {
  try {
    await db.query('DELETE FROM ratings WHERE id = $1', [req.params.id])
    res.status(200).json('Deleted Successfully!')
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

module.exports = router
