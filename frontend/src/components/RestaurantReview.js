import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'
import StarRating from './StarRating'

function RestaurantReview(props) {
  const { review, ratings, setRatings, restaurant, setRestaurant, setRatingsCollection } = props

  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  async function handleDelete() {
    try {
      await axios.delete(`/api/ratings/${review.id}`)
      // Update the rating & count displayed on page
      updatePageRating()
      // Remove from page
      setRatings(prev => prev.filter(rating => rating.id !== review.id))
      setRatingsCollection(prev => prev.filter(rating => rating.id !== review.id))
      dispatch({ type: 'FlashMessage', value: 'Review was successfully deleted!', color: 'success' })
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }

  function updatePageRating() {
    let sumOfRatings = 0
    // Add each rating to the sum
    ratings.forEach(item => {
      sumOfRatings += parseFloat(item.rating)
    })
    // Subtracts the deleted rating from sum
    sumOfRatings -= parseFloat(review.rating)
    // Calculates new rating
    let updatedRating = (sumOfRatings / (ratings.length - 1)).toFixed(1)
    // Updates the restaurants rating & count state
    setRestaurant({ ...restaurant, rating: updatedRating, count: restaurant.count - 1 })
  }

  function reviewColor() {
    if (review.rating < 3) {
      return 'bg-danger'
    } else {
      return 'bg-success'
    }
  }

  return (
    <div className="review-container">
      <div>{review.name}</div>
      <div>
        <StarRating rating={review.rating} />
      </div>
      <p>{review.message}</p>
      {state.loggedIn && (
        <button type="submit" className="review-btn btn btn-light" onClick={handleDelete}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
      )}
    </div>
  )
}

export default RestaurantReview
