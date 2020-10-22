import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Home(props) {
  // Set up state
  const [isLoading, setIsLoading] = useState(true)
  const [restaurants, setRestaurants] = useState([])

  let history = useHistory()

  // Acquire restaurant data on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/restaurants')
        setRestaurants(response.data)
        setIsLoading(false)
      } catch (err) {
        // Replace alert with flash message. Also add in redirect to 500 Internal Error page
        alert(err.response.data)
      }
    }
    fetchData()
  }, [])

  // Functions
  async function handleEdit(id) {
    history.push(`/restaurant/update/${id}`)
  }

  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (confirm) {
      try {
        await axios.delete(`/restaurants/${id}`)
        setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id))
      } catch (err) {
        // Replace alert with flash message
        alert(err.response.data)
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
              <button
                onClick={() => {
                  handleEdit(restaurant.id)
                }}
              >
                Edit Restaurant
              </button>
              <button
                onClick={() => {
                  handleDelete(restaurant.id)
                }}
              >
                Delete Restaurant
              </button>
              <br />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Home
