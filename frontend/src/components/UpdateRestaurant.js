import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

function UpdateRestaurant(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [restaurant, setRestaurant] = useState()

  let history = useHistory()

  const { id } = useParams()

  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const response = await axios.get(`/restaurants/${id}`)
        setRestaurant(response.data)
        setIsLoading(false)
      } catch (err) {
        history.push('/')
        // Add in flash message with the err.response.data as the message
      }
    }
    fetchRestaurantData()
  }, [id])

  async function submitHandler(e) {
    e.preventDefault()
    try {
      await axios.put(`/restaurants/${id}`, {
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        priceRange: parseInt(restaurant.pricerange)
      })
      history.push(`/restaurant/${id}`)
    } catch (err) {
      // Replace this alert with a flash message that has err.response.data as the message
      alert(err.response.data)
    }
  }

  function updateInput(e) {
    setRestaurant({ ...restaurant, [e.currentTarget.name]: e.currentTarget.value })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>Update Restaurant</h1>
      <form onSubmit={submitHandler}>
        <input name="name" type="text" value={restaurant.name} onChange={e => updateInput(e)} required />
        <input name="description" type="text" value={restaurant.description} onChange={e => updateInput(e)} required />
        <input name="location" type="text" value={restaurant.location} onChange={e => updateInput(e)} required />
        <input name="pricerange" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
        <button type="submit">Update Restaurant</button>
      </form>
    </>
  )
}

export default UpdateRestaurant
