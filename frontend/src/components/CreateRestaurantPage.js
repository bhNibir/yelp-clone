import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function CreateRestaurantPage(props) {
  const [restaurant, setRestaurant] = useState({
    name: '',
    description: '',
    pricerange: '',
    street: '',
    city: '',
    province: '',
    country: '',
    postalcode: ''
  })

  let history = useHistory()
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  async function submitHandler(e) {
    e.preventDefault()
    try {
      let location = `${restaurant.street} ${restaurant.city} ${restaurant.province} ${restaurant.country}`
      const apiResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: process.env.REACT_APP_API_KEY
        }
      })
      let lat = apiResponse.data.results[0].geometry.location.lat
      let lng = apiResponse.data.results[0].geometry.location.lng

      const response = await axios.post(`/api/restaurants`, {
        name: restaurant.name,
        description: restaurant.description,
        priceRange: parseInt(restaurant.pricerange),
        street: restaurant.street,
        city: restaurant.city,
        province: restaurant.province,
        country: restaurant.country,
        postalcode: restaurant.postalcode,
        longtitude: lng,
        latitude: lat
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
        <input name="pricerange" placeholder="Price Range" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
        <input name="street" placeholder="Street" type="text" value={restaurant.street} onChange={e => updateInput(e)} required />
        <input name="city" placeholder="City" type="text" value={restaurant.city} onChange={e => updateInput(e)} required />
        <input name="province" placeholder="Province" type="text" value={restaurant.province} onChange={e => updateInput(e)} required />
        <input name="country" placeholder="Country" type="text" value={restaurant.country} onChange={e => updateInput(e)} required />
        <input name="postalcode" placeholder="Postal Code" type="text" value={restaurant.postalcode} onChange={e => updateInput(e)} required />
        <button type="submit">Create New Restaurant</button>
      </form>
    </>
  )
}

export default CreateRestaurantPage
