const router = require('express').Router()
const db = require('../db')
const isRestaurantIDValid = require('../middleware/isRestaurantIDValid')
const validateRestaurantInput = require('../middleware/validateRestaurantInput')

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const results = await db.query('SELECT restaurants.id, restaurants.name, description, location, priceRange, ROUND(AVG(rating), 1) AS rating, COUNT(rating) FROM restaurants LEFT OUTER JOIN ratings ON (restaurants.id = ratings.restaurant_id) GROUP BY restaurants.id')
    const data = results.rows
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Get a single restaurant
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT restaurants.id, restaurants.name, description, location, priceRange, ROUND(AVG(rating), 1) AS rating, COUNT(rating) FROM restaurants LEFT OUTER JOIN ratings ON (restaurants.id = ratings.restaurant_id) WHERE restaurants.id = $1 GROUP BY restaurants.id', [req.params.id])
    if (result.rows.length > 0) {
      const data = result.rows[0]
      res.status(200).json(data)
    } else {
      res.status(404).json('Restaurant could not be found.')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Create a new restaurant
router.post('/', validateRestaurantInput, async (req, res) => {
  try {
    // Input will already be validated & ready to be inserted into database
    const { name, description, location, priceRange } = req.body
    const result = await db.query('INSERT INTO restaurants (name, description, location, priceRange) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, location, priceRange])
    const data = result.rows[0]
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Update a restaurant
router.put('/:id', isRestaurantIDValid, validateRestaurantInput, async (req, res) => {
  try {
    // Input will already be validated & ready to be inserted into database
    const { name, description, location, priceRange } = req.body
    const result = await db.query('UPDATE restaurants SET name = $1, description = $2, location = $3, priceRange = $4 WHERE id = $5 RETURNING *', [name, description, location, priceRange, req.params.id])
    const data = result.rows[0]
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Delete a restaurant
router.delete('/:id', isRestaurantIDValid, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM restaurants WHERE id = $1', [req.params.id])
    res.status(200).json('Deleted Successfully')
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

module.exports = router
