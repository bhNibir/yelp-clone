import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'

function SortRestaurants({ setRestaurants, setRestaurantCollection }) {
  const [locationType, setLocationType] = useState('')
  const [location, setLocation] = useState('')

  const dispatch = useContext(AppContext)

  async function handleSubmit(e) {
    e.preventDefault()
    if (locationType && location) {
      try {
        const response = await axios.get(`/restaurants/search?locationType=${locationType}&location=${location}`)
        setRestaurants(response.data.slice(0, 10))
        setRestaurantCollection(response.data)
        setLocation('')
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    } else {
      dispatch({ type: 'FlashMessage', value: 'You cannot leave the fields blank.', color: 'error' })
    }
  }

  async function resetRestaurantList() {
    try {
      const response = await axios.get('/restaurants')
      setRestaurants(response.data.slice(0, 10))
      setRestaurantCollection(response.data)
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }
  return (
    <>
      <h5>Search for businesses near you...</h5>
      <form onSubmit={handleSubmit}>
        <select onChange={e => setLocationType(e.currentTarget.value)} defaultValue={'Search by...'}>
          <option disabled>Search by...</option>
          <option value="street">Street</option>
          <option value="city">City</option>
          <option value="province">Province</option>
          <option value="country">Country</option>
          <option value="postalcode">Postal Code</option>
        </select>
        <input type="text" value={location} placeholder={locationType ? `Enter ${locationType}...` : 'Enter location...'} onChange={e => setLocation(e.currentTarget.value)} />
        <button type="submit">Search Restaurants</button>
      </form>
      <button onClick={resetRestaurantList}>View All Restaurants</button>
    </>
  )
}

export default SortRestaurants
