import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../AppContext'
import StateContext from '../StateContext'
import PageLoader from './PageLoader'

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
  const [file, setFile] = useState()
  const [uploadedImages, setUploadedImages] = useState()

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
          key: 'AIzaSyCcbP47PnbbLWJ4T9GdciB5LCrFSSIP-EA'
        }
      })
      let lat = apiResponse.data.results[0].geometry.location.lat
      let lng = apiResponse.data.results[0].geometry.location.lng

      // Update restaurant details in database
      const response = await axios.put(`/api/restaurants/${id}`, {
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

      history.push(`/restaurant/${id}`)
      dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully updated!', color: 'success' })
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

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <div className="restaurant-form">
        <h1 className="create-title">Update Restaurant</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input className="form-control" id="name" name="name" placeholder="Name" type="text" value={restaurant.name} onChange={e => updateInput(e)} required />
          </div>

          <div className="form-group">
            <label htmlFor="street">Street:</label>
            <input className="form-control" id="street" name="street" placeholder="Street" type="text" value={restaurant.street} onChange={e => updateInput(e)} required />
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="city">City:</label>
              <input className="form-control" id="city" name="city" placeholder="City" type="text" value={restaurant.city} onChange={e => updateInput(e)} required />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="province">Province:</label>
              <input className="form-control" id="province" name="province" placeholder="Province" type="text" value={restaurant.province} onChange={e => updateInput(e)} required />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="country">Country:</label>
              <input className="form-control" id="country" name="country" placeholder="Country" type="text" value={restaurant.country} onChange={e => updateInput(e)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="postalcode">Postal Code:</label>
              <input className="form-control" id="postalcode" name="postalcode" placeholder="Postal Code" type="text" value={restaurant.postalcode} onChange={e => updateInput(e)} required />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="pricerange">Price Range:</label>
              <input className="form-control" id="pricerange" name="pricerange" placeholder="Price Range" type="number" value={restaurant.pricerange} onChange={e => updateInput(e)} required max="5" min="1" />
            </div>
            <div className="form-group col-md-4">
              <label>Add Photos (Optional):</label>
              <div className="custom-file">
                <input type="file" className="custom-file-input" id="image-file" onChange={updateFileState} multiple />
                <label className="custom-file-label" htmlFor="image-file">
                  Choose file...
                </label>
              </div>
            </div>
          </div>
          {uploadedImages && uploadedImages[0] && <label>New Images:</label>}
          <div className="image-container">
            {uploadedImages &&
              uploadedImages.map((url, index) => (
                <div key={index}>
                  <div style={{ width: '70px', height: '70px' }}>
                    <img style={{ width: '70px', height: '70px' }} src={url} />
                  </div>
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea className="form-control" id="description" name="description" placeholder="Description" type="text" value={restaurant.description} onChange={e => updateInput(e)} required />
          </div>
          <div className="my-4"></div>
          <button type="submit" className="btn create-btn btn-block mx-auto">
            Update Restaurant
          </button>
        </form>
      </div>
    </>
  )
}

export default UpdateRestaurant
