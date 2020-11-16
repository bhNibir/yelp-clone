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
  const [file, setFile] = useState()
  const [uploadedImages, setUploadedImages] = useState()

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
          key: 'AIzaSyCcbP47PnbbLWJ4T9GdciB5LCrFSSIP-EA'
        }
      })
      let lat = apiResponse.data.results[0].geometry.location.lat
      let lng = apiResponse.data.results[0].geometry.location.lng

      // Add restaurant to database
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

      if (file) {
        let formData = new FormData()
        for (let i = 0; i < file.length; i++) {
          formData.append(`image`, file[i])
        }

        await axios.post(`/api/restaurants/upload-image/${response.data.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully created!', color: 'success' })
      history.push(`/restaurant/${response.data.id}`)
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }

  // Update field input
  function updateInput(e) {
    setRestaurant({ ...restaurant, [e.currentTarget.name]: e.currentTarget.value })
  }

  // Update File State
  function updateFileState(e) {
    let urlList = []
    let files = []
    // Loops over uploaded files, and only saves png/jpeg files that are below 2MB
    for (var i = 0, n = e.currentTarget.files.length; i < n; i++) {
      let currentFile = e.currentTarget.files[i]
      if (currentFile.type == 'image/png' || currentFile.type == 'image/jpeg') {
        // Make sure file is less than 2MB
        if (currentFile.size < 2097152) {
          files.push(currentFile)
          urlList.push(URL.createObjectURL(currentFile))
        } else {
          dispatch({ type: 'FlashMessage', value: `${currentFile.name} is too big! Images must be below 2MB`, color: 'error' })
        }
      }
    }
    setFile(files)
    setUploadedImages(urlList)
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
        <input type="file" onChange={updateFileState} multiple />
        <button type="submit">Create New Restaurant</button>
      </form>
      {uploadedImages &&
        uploadedImages.map((url, index) => (
          <div key={index}>
            <div style={{ width: '200px', height: '200px' }}>
              <img style={{ width: '200px', height: '200px' }} src={url} />
            </div>
          </div>
        ))}
    </>
  )
}

export default CreateRestaurantPage
