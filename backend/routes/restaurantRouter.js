const router = require('express').Router()
const db = require('../db')
const isRestaurantIDValid = require('../middleware/isRestaurantIDValid')
const validateRestaurantInput = require('../middleware/validateRestaurantInput')

// Search for restaurant
router.get('/search', async (req, res) => {
  const { locationType, location } = req.query
  const locationTypes = ['street', 'city', 'province', 'country', 'postalcode']
  // Helps protect against SQL injection attack
  if (!locationTypes.includes(locationType)) {
    return res.status(403).json('Invalid Location Type.')
  }
  try {
    const results = await db.query(`SELECT restaurants.id, restaurants.name, description, longtitude, latitude, priceRange, ROUND(AVG(rating), 1) AS rating, COUNT(rating) FROM restaurants LEFT OUTER JOIN ratings ON (restaurants.id = ratings.restaurant_id) WHERE UPPER(restaurants.${locationType}) LIKE UPPER($1) GROUP BY restaurants.id`, [`%${location}%`])
    res.status(200).json(results.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const results = await db.query('SELECT restaurants.id, restaurants.name, description, longtitude, latitude, priceRange, ROUND(AVG(rating), 1) AS rating, COUNT(rating) FROM restaurants LEFT OUTER JOIN ratings ON (restaurants.id = ratings.restaurant_id) GROUP BY restaurants.id')
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
    const result = await db.query('SELECT restaurants.id, restaurants.name, description, street, city, province, country, postalcode, longtitude, latitude, priceRange, ROUND(AVG(rating), 1) AS rating, COUNT(rating) FROM restaurants LEFT OUTER JOIN ratings ON (restaurants.id = ratings.restaurant_id) WHERE restaurants.id = $1 GROUP BY restaurants.id', [req.params.id])
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
    const { name, description, priceRange, street, city, province, country, postalcode, longtitude, latitude } = req.body
    const result = await db.query('INSERT INTO restaurants (name, description, priceRange, street, city, province, country, postalcode, longtitude, latitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [name, description, priceRange, street, city, province, country, postalcode, longtitude, latitude])
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
    const { name, description, priceRange, street, city, province, country, postalcode, longtitude, latitude } = req.body
    const result = await db.query('UPDATE restaurants SET name = $1, description = $2, priceRange = $3, street = $4, city = $5, province = $6, country = $7, postalcode = $8, longtitude = $9, latitude = $10 WHERE id = $11 RETURNING *', [name, description, priceRange, street, city, province, country, postalcode, longtitude, latitude, req.params.id])
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
