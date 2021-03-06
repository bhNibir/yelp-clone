const db = require('../db')

async function validateRestaurantInput(req, res, next) {
  try {
    const { name, description, priceRange, street, city, province, country, postalcode } = req.body
    // Confirm input type is correct
    if (typeof name !== 'string' || typeof description !== 'string' || typeof priceRange !== 'number' || typeof street !== 'string' || typeof city !== 'string' || typeof province !== 'string' || typeof country !== 'string' || typeof postalcode !== 'string') {
      return res.status(403).json('You cannot leave the fields blank.')
    }
    // Check if empty
    if (trim(name) || trim(description) || !priceRange || trim(street) || trim(city) || trim(province) || trim(country) || trim(postalcode)) {
      return res.status(403).json('You cannot leave the fields blank.')
    }
    // Confirm correct length for name, description, & location
    if (!checkLength(name, 1, 255) || !checkLength(description, 1, 255) || !checkLength(street, 1, 255) || !checkLength(city, 1, 255) || !checkLength(province, 1, 255) || !checkLength(country, 1, 255) || !checkLength(postalcode, 1, 255)) {
      return res.status(403).json('Input exceeded length specifications.')
    }
    // Confirm correct number range for priceRange
    if (priceRange < 1 || priceRange > 5) {
      return res.status(403).json('Price must be between 1 and 5')
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
