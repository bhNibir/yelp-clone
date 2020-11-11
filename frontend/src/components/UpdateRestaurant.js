import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function UpdateRestaurant(props) {
  const [isLoading, setIsLoading] = useState(true)
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
          const response = await axios.get(`/api/restaurants/${id}`)
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
      let location = `${restaurant.street} ${restaurant.city} ${restaurant.province} ${restaurant.country}`
      const apiResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: process.env.REACT_APP_API_KEY
        }
      })
      let lat = apiResponse.data.results[0].geometry.location.lat
      let lng = apiResponse.data.results[0].geometry.location.lng

      await axios.put(`/api/restaurants/${id}`, {
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
        <input name="pricerange" placeholder="Price Range" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
        <input name="street" placeholder="Street" type="text" value={restaurant.street} onChange={e => updateInput(e)} required />
        <input name="city" placeholder="City" type="text" value={restaurant.city} onChange={e => updateInput(e)} required />
        <input name="province" placeholder="Province" type="text" value={restaurant.province} onChange={e => updateInput(e)} required />
        <input name="country" placeholder="Country" type="text" value={restaurant.country} onChange={e => updateInput(e)} required />
        <input name="postalcode" placeholder="Postal Code" type="text" value={restaurant.postalcode} onChange={e => updateInput(e)} required />
        <button type="submit">Update Restaurant</button>
      </form>
    </>
  )
}

export default UpdateRestaurant
