const db = require('../db')

async function validateRestaurantInput(req, res, next) {
  try {
    const { name, description, location, priceRange } = req.body
    // Confirm input type is correct
    if (typeof name !== 'string' || typeof description !== 'string' || typeof location !== 'string' || typeof priceRange !== 'number') {
      return res.status(400).json('Incorrect field type.')
    }
    // Check if empty
    if (trim(name) || trim(description) || trim(location) || !priceRange) {
      return res.status(400).json('You cannot leave the fields blank.')
    }
    // Confirm correct length for name, description, & location
    if (!checkLength(name, 1, 255) || !checkLength(description, 1, 255) || !checkLength(location, 1, 255)) {
      return res.status(400).json('Input exceeded length specifications.')
    }
    // Confirm correct number range for priceRange
    if (priceRange < 1 || priceRange > 5) {
      return res.status(400).json('Price must be between 1 and 5')
    }
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
}

function trim(input) {
  if (!input.replace(/\s/g, '').length) {
    return true
  }
  return false
}

function checkLength(value, min, max) {
  if (value.length >= min && value.length <= max) {
    return true
  }
  return false
}

module.exports = validateRestaurantInput
