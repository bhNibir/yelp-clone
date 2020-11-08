import React, { useEffect, useState } from 'react'

function SortRestaurants(props) {
  const [locationType, setLocationType] = useState('')
  const [location, setLocation] = useState('')
  async function handleSubmit(e) {
    e.preventDefault()
    console.log(locationType)
    console.log(location)
  }
  return (
    <>
      <h5>Search for businesses near you...</h5>
      <form onSubmit={handleSubmit}>
        <select onChange={e => setLocationType(e.currentTarget.value)}>
          <option disabled selected>
            Search by...
          </option>
          <option value="street">Street</option>
          <option value="city">City</option>
          <option value="province">Province</option>
          <option value="country">Country</option>
          <option value="postalcode">Postal Code</option>
        </select>
        <input type="text" value={location} placeholder={locationType ? `Enter ${locationType}...` : 'Enter location...'} onChange={e => setLocation(e.currentTarget.value)} />
        <button type="submit">Search Restaurants</button>
      </form>
    </>
  )
}

export default SortRestaurants
