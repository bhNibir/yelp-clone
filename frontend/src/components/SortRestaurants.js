import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'

function SortRestaurants({ setRestaurants, setRestaurantCollection, restaurantCollection, setSortCount }) {
  const [locationType, setLocationType] = useState('')
  const [location, setLocation] = useState('')
  const [showButton, setShowButton] = useState(false)

  const dispatch = useContext(AppContext)

  async function handleSubmit(e) {
    e.preventDefault()
    if (locationType && location) {
      try {
        const response = await axios.get(`/restaurants/search?locationType=${locationType}&location=${location}`)
        setRestaurants(response.data.slice(0, 10))
        setRestaurantCollection(response.data)
        setLocation('')
        setShowButton(true)
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
      setShowButton(false)
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }

  function arrangeRestaurants(e) {
    let newList
    switch (e.currentTarget.value) {
      case 'highest-rated':
        newList = [...restaurantCollection].sort((a, b) => b.rating - a.rating)
        break
      case 'lowest-rated':
        newList = [...restaurantCollection].sort((a, b) => a.rating - b.rating)
        break
      case 'price-high-low':
        newList = [...restaurantCollection].sort((a, b) => b.pricerange - a.pricerange)
        break
      case 'price-low-high':
        newList = [...restaurantCollection].sort((a, b) => a.pricerange - b.pricerange)
        break
      case 'most-rated':
        newList = [...restaurantCollection].sort((a, b) => b.count - a.count)
        break
      case 'alphabetical-a-z':
        newList = [...restaurantCollection].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'alphabetical-z-a':
        newList = [...restaurantCollection].sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        newList = [...restaurantCollection]
        break
    }
    setRestaurants(newList.slice(0, 10))
    setRestaurantCollection(newList)
    setSortCount(prev => prev + 1)
  }
  return (
    <>
      Sort by:
      <select onChange={arrangeRestaurants} defaultValue="Select...">
        <option disabled value="Select...">
          Select...
        </option>
        <option value="highest-rated">Highest Rated</option>
        <option value="lowest-rated">Lowest Rated</option>
        <option value="most-rated">Most Reviewed</option>
        <option value="price-high-low">Price: High-Low</option>
        <option value="price-low-high">Price: Low-High</option>
        <option value="alphabetical-a-z">Alphabetical (A-Z)</option>
        <option value="alphabetical-z-a">Alphabetical (Z-A)</option>
      </select>
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
      {showButton && <button onClick={resetRestaurantList}>View All Restaurants</button>}
    </>
  )
}

export default SortRestaurants
