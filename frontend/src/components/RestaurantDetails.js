import React, { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import RestaurantReview from './RestaurantReview'

function RestaurantDetails(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [restaurant, setRestaurant] = useState()
  const [ratings, setRatings] = useState([])

  const history = useHistory()
  const { id } = useParams()

  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const response = await axios.get(`/restaurants/${id}`)
        setRestaurant(response.data)
        fetchRestaurantReviews()
      } catch (err) {
        history.push('/')
        // Add a flash message with the err.response.data
      }
    }
    async function fetchRestaurantReviews() {
      try {
        const response = await axios.get(`/ratings/${id}`)
        setRatings(response.data)
        console.log(response.data)
        setIsLoading(false)
      } catch (err) {
        // Replace alert with a flash message
        alert(err.response.data)
      }
    }
    fetchRestaurantData()
  }, [id])

  // Handle Delete Button Click
  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (confirm) {
      try {
        await axios.delete(`/restaurants/${id}`)
        history.push('/')
      } catch (err) {
        // Replace alert with flash message
        alert(err.response.data)
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>{restaurant.name}</h1>
      <div>
        {ratings.map(review => {
          return <RestaurantReview key={review.id} {...review} />
        })}
      </div>
      <br />
      <h3>Page Details</h3>
      <div>name: {restaurant.name}</div>
      <div>description: {restaurant.description}</div>
      <div>location: {restaurant.location}</div>
      <div>pricerange: {restaurant.pricerange}</div>
      <div>rating: {restaurant.rating}</div>
      <div>count: {restaurant.count}</div>
      <Link to={`/restaurant/${restaurant.id}/update`}>Edit Restaurant</Link>
      <button onClick={() => handleDelete(restaurant.id)}>Delete Restaurant</button>
    </>
  )
}

export default RestaurantDetails
