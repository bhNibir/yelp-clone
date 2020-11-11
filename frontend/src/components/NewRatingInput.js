import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'

function NewRatingInput({ id, setRatings, ratings, setRestaurant, restaurant, setRatingsCollection }) {
  const [newRating, setNewRating] = useState({
    restaurant_id: id,
    rating: '',
    name: '',
    message: ''
  })
  const dispatch = useContext(AppContext)

  function updateInput(e) {
    setNewRating({ ...newRating, [e.currentTarget.name]: e.currentTarget.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    // Confirms fields have values & rating is between 1-5 before sending request to server
    if (newRating.restaurant_id && 1 <= parseFloat(newRating.rating) <= 5 && newRating.name && newRating.message) {
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
        setRatings(prev => [response.data].concat(prev))
        setRatingsCollection(prev => [response.data].concat(prev))
        // Reset the form field inputs to empty
        setNewRating({ restaurant_id: id, rating: '', name: '', message: '' })
        // Sends off success message
        dispatch({ type: 'FlashMessage', value: 'Review was successfully published!', color: 'success' })
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    } else {
      dispatch({ type: 'FlashMessage', value: 'You cannot leave the fields blank.', color: 'error' })
    }
  }

  function updateCurrentPageRating(newRating) {
    let sumOfRatings = parseFloat(newRating)
    // Loops over each rating to get sum
    ratings.forEach(review => {
      sumOfRatings += parseFloat(review.rating)
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
