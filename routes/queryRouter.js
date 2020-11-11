const router = require('express').Router()
const db = require('../db')

// Get list of restaurants that match search result
router.get('/:query', async (req, res) => {
  try {
    const { query } = req.params
    const response = await db.query('SELECT * FROM restaurants WHERE UPPER(name) LIKE UPPER($1)', [`%${query}%`])
    const data = response.rows
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

module.exports = router
