const db = require('../db')

async function isRestaurantIDValid(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM restaurants WHERE id = $1', [req.params.id])
    if (result.rows.length > 0) {
      next()
    } else {
      res.status(404).json('A restaurant with that ID does not exist.')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
}

module.exports = isRestaurantIDValid
