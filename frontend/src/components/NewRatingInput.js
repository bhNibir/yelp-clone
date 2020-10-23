import React, { useEffect, useState } from 'react'
import axios from 'axios'

function NewRatingInput({ id, setRatings, ratings, setRestaurant, restaurant }) {
  const [newRating, setNewRating] = useState({
    restaurant_id: id,
    rating: '',
    name: '',
    message: ''
  })

  function updateInput(e) {
    setNewRating({ ...newRating, [e.currentTarget.name]: e.currentTarget.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      // Sends off request to store new rating in database
      const response = await axios.post(`/ratings/`, {
        restaurant_id: newRating.restaurant_id,
        rating: parseFloat(newRating.rating),
        name: newRating.name,
        message: newRating.message
      })
      // Update the rating & count displayed on page
      updateCurrentPageRating(newRating.rating)
      // Add the new review to the page
      setRatings(prev => prev.concat(response.data))
      // Reset the form field inputs to empty
      setNewRating({ restaurant_id: id, rating: '', name: '', message: '' })
      // Send success flash message here
    } catch (err) {
      // Replace alert with flash message
      alert(err.response.data)
    }
  }

  function updateCurrentPageRating(newRating) {
    let sumOfRatings = parseFloat(newRating)
    // Loops over each rating to get sum
    ratings.forEach(review => {
      sumOfRatings += review.rating
    })
    // Calculates new average rating
    let updatedRating = (sumOfRatings / (ratings.length + 1)).toFixed(1)
    // Updates the state
    setRestaurant({ ...restaurant, rating: updatedRating, count: parseInt(restaurant.count) + 1 })
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="number" name="rating" placeholder="Rating" value={newRating.rating} onChange={e => updateInput(e)} min="1" max="5" step="0.1" />
        <input type="text" name="name" placeholder="Name" value={newRating.name} onChange={e => updateInput(e)} />
        <input type="text" name="message" placeholder="Message" value={newRating.message} onChange={e => updateInput(e)} />
        <button type="submit">Submit Review</button>
      </form>
    </>
  )
}

export default NewRatingInput