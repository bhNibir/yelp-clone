const db = require('../db')

async function validateRatingInput(req, res, next) {
  try {
    const { rating, name, message } = req.body
    // Confirm input type is correct
    if (typeof rating !== 'number' || typeof name !== 'string' || typeof message !== 'string') {
      return res.status(403).json('You cannot leave the fields blank.')
    }
    // Check if empty
    if (trim(name) || trim(message) || !rating) {
      return res.status(403).json('You cannot leave the fields blank.')
    }
    // Confirm correct length for name, description, & location
    if (!checkLength(name, 1, 255) || !checkLength(message, 1, 2000)) {
      return res.status(403).json('Input exceeded length specifications.')
    }
    // Confirm correct number range for rating
    if (rating < 1 || rating > 5) {
      return res.status(403).json('Rating must be between 1 and 5')
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

module.exports = validateRatingInput
