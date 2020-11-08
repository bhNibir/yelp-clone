import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function UpdateRestaurant(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [restaurant, setRestaurant] = useState()

  let history = useHistory()
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)
  const { id } = useParams()

  // Redirect if user not logged in
  useEffect(() => {
    if (!state.loggedIn) {
      history.push('/')
      dispatch({ type: 'FlashMessage', value: 'You do not have the authorization to view that page.', color: 'error' })
    }
  }, [state.loggedIn])

  useEffect(() => {
    if (state.loggedIn) {
      async function fetchRestaurantData() {
        try {
          const response = await axios.get(`/restaurants/${id}`)
          setRestaurant(response.data)
          setIsLoading(false)
        } catch (err) {
          dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
          history.push('/')
        }
      }
      fetchRestaurantData()
    }
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
      dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully updated!', color: 'success' })
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
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
        <input name="name" placeholder="Name" type="text" value={restaurant.name} onChange={e => updateInput(e)} required />
        <input name="description" placeholder="Description" type="text" value={restaurant.description} onChange={e => updateInput(e)} required />
        <input name="location" placeholder="Location" type="text" value={restaurant.location} onChange={e => updateInput(e)} required />
        <input name="pricerange" placeholder="Price Range" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
        <button type="submit">Update Restaurant</button>
      </form>
    </>
  )
}

export default UpdateRestaurant
