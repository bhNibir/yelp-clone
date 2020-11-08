import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function CreateRestaurantPage(props) {
  const [restaurant, setRestaurant] = useState({
    name: '',
    description: '',
    location: '',
    pricerange: ''
  })

  let history = useHistory()
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  async function submitHandler(e) {
    e.preventDefault()
    try {
      const response = await axios.post(`/restaurants`, {
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        priceRange: parseInt(restaurant.pricerange)
      })
      dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully created!', color: 'success' })
      history.push(`/restaurant/${response.data.id}`)
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }

  function updateInput(e) {
    setRestaurant({ ...restaurant, [e.currentTarget.name]: e.currentTarget.value })
  }

  // Redirect if user not logged in
  useEffect(() => {
    if (!state.loggedIn) {
      dispatch({ type: 'FlashMessage', value: 'You do not have the authorization to view that page.', color: 'error' })
      history.push('/')
    }
  }, [state.loggedIn])

  return (
    <>
      <h1>Create New Restaurant</h1>
      <form onSubmit={submitHandler}>
        <input name="name" placeholder="Name" type="text" value={restaurant.name} onChange={e => updateInput(e)} required />
        <input name="description" placeholder="Description" type="text" value={restaurant.description} onChange={e => updateInput(e)} required />
        <input name="location" placeholder="Location" type="text" value={restaurant.location} onChange={e => updateInput(e)} required />
        <input name="pricerange" placeholder="Price Range" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
        <button type="submit">Update Restaurant</button>
      </form>
    </>
  )
}

export default CreateRestaurantPage
