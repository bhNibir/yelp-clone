import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useHistory, Link } from 'react-router-dom'
import AppContext from '../AppContext'

function Home(props) {
  // Set up state
  const [isLoading, setIsLoading] = useState(true)
  const [restaurants, setRestaurants] = useState([])

  const dispatch = useContext(AppContext)
  let history = useHistory()

  // Acquire restaurant data on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/restaurants')
        setRestaurants(response.data)
        setIsLoading(false)
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
    fetchData()
  }, [])

  // Handles Delete Button Click
  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (confirm) {
      try {
        await axios.delete(`/restaurants/${id}`)
        setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id))
        dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully deleted!', color: 'success' })
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
  }

  // Send back loading page until data has been retrieved
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>Restaurants List</h1>
      <div>
        {restaurants.map(restaurant => {
          return (
            <div key={restaurant.id}>
              <br />
              <div>Name: {restaurant.name}</div>
              <div>Description: {restaurant.description}</div>
              <div>Location: {restaurant.location}</div>
              <div>Price Range: {restaurant.pricerange}</div>
              <div>Rating: {restaurant.rating}</div>
              <div>Rating Count: {restaurant.count}</div>
              <Link to={`/restaurant/${restaurant.id}`}>View Details</Link>
              <Link to={`/restaurant/${restaurant.id}/update`}>Edit Restaurant</Link>
              <button onClick={() => handleDelete(restaurant.id)}>Delete Restaurant</button>
              <br />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Home
