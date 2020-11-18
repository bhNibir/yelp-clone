import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import RestaurantReview from './RestaurantReview'
import NewRatingInput from './NewRatingInput'
import AppContext from '../AppContext'
import StateContext from '../StateContext'
import StarRating from './StarRating'
import RestaurantMap from './RestaurantMap'
import PageLoader from './PageLoader'

function RestaurantDetails(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [restaurant, setRestaurant] = useState()
  const [ratings, setRatings] = useState([])
  const [ratingsCollection, setRatingsCollection] = useState([])
  const [counter, setCounter] = useState(8)
  const [isMoreRatings, setIsMoreRatings] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [loadEvent, setLoadEvent] = useState(0)

  const history = useHistory()
  const { id } = useParams()
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const response = await axios.get(`/api/restaurants/${id}`)
        setRestaurant(response.data)
        fetchRestaurantReviews()
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: 'A restaurant with that id does not exist', color: 'error' })
        history.push('/')
      }
    }
    async function fetchRestaurantReviews() {
      try {
        const response = await axios.get(`/api/ratings/${id}`)
        setRatingsCollection(response.data)
        setRatings(response.data.slice(0, counter))
        if (response.data.length > 8) setIsMoreRatings(true)
        setIsLoading(false)
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
    fetchRestaurantData()
  }, [id])

  // Handle Restaurant Image Delete
  async function deleteImage(id) {
    const confirm = window.confirm('Are you sure you want to delete this image?')
    if (confirm) {
      try {
        await axios.delete(`/api/restaurants/delete-image/${id}`)
        let updatedImages = restaurant.images.filter(image => image.id !== id)
        setRestaurant({ ...restaurant, images: updatedImages })
        dispatch({ type: 'FlashMessage', value: 'Image deleted successfully!', color: 'success' })
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
  }

  // Handle Restaurant Delete Button Click
  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this restaurant?')
    if (confirm) {
      try {
        await axios.delete(`/api/restaurants/${id}`)
        dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully deleted!', color: 'success' })
        history.push('/')
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
  }

  // Handle Load More Button
  useEffect(() => {
    setScrollPosition(window.scrollY)
    setRatings(ratingsCollection.slice(0, counter))
    setLoadEvent(prev => prev + 1)
    if (ratingsCollection.length && counter >= ratingsCollection.length) {
      setIsMoreRatings(false)
    }
  }, [counter])

  // Restores current page position after loading new ratings
  useEffect(() => {
    window.scrollTo(0, scrollPosition)
  }, [loadEvent])

  // Get price range in dollar sign form
  function getDollarSignValue(price) {
    let dollarAmount = ''
    for (var i = 0; i < price; i++) {
      dollarAmount += '$'
    }
    return dollarAmount
  }

  // Handles "Write Review" Button Click
  function scrollToReviewSection() {
    const reviewSection = document.querySelector('.review-form-container')
    window.scrollTo(0, reviewSection.offsetTop - 30)
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
      {restaurant.images.length > 0 && (
        <div className="restaurant-images-container">
          {restaurant.images.map(image => (
            <div key={image.id}>
              <div className="restaurant-image-container">
                {state.loggedIn && (
                  <button className="remove-image-btn btn btn-light" onClick={() => deleteImage(image.id)}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                )}
                <img className="restaurant-img" src={image.url_location} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <h1 className="mt-3 restaurant-title">{restaurant.name}</h1>
        <div style={{ cursor: 'pointer' }} onClick={() => scrollToReviewSection()}>
          {restaurant.rating > 0 ? <StarRating rating={restaurant.rating} count={restaurant.count} /> : 'No Ratings'}
        </div>
      </div>
      {state.loggedIn && (
        <div className="admin-btn-container my-3">
          <Link className="admin-btn btn mx-2" to={`/restaurant/${restaurant.id}/update`}>
            <i className="fa fa-camera" aria-hidden="true"></i> Add Photo(s)
          </Link>
          <Link className="admin-btn btn mx-2" to={`/restaurant/${restaurant.id}/update`}>
            <i className="fa fa-pencil" aria-hidden="true"></i> Edit Restaurant
          </Link>
          <button className="admin-btn btn mx-2" onClick={() => handleDelete(restaurant.id)}>
            <i className="fa fa-trash-o" aria-hidden="true"></i> Delete Restaurant
          </button>
        </div>
      )}
      {!state.loggedIn && (
        <div className="admin-btn-container my-3">
          <button className="admin-btn btn mx-2" onClick={() => scrollToReviewSection()}>
            <i className="fa fa-star-o" aria-hidden="true"></i> Write Review
          </button>
        </div>
      )}
      <div className="restaurant-details-background">
        <div className="d-flex restaurant-details-container">
          <div className="restaurant-details-map-container">
            <RestaurantMap restaurant={restaurant} />
          </div>
          <div className="details-list">
            <h4>{restaurant.name} Details:</h4>
            <div>
              Address:
              <p>
                {restaurant.street}, {restaurant.city}, {restaurant.province}, {restaurant.country}
              </p>
            </div>
            <div>
              Description:
              <p>{restaurant.description}</p>
            </div>
            <div className="mb-2">Price Range: {getDollarSignValue(restaurant.pricerange)}</div>
            <div>
              {restaurant.rating >= 3 ? (
                <p className="text-success my-0">
                  <i className="fa fa-check-square-o mr-2" aria-hidden="true"></i>Above Average Rating
                </p>
              ) : (
                <p className="text-danger my-0">
                  <i className="fa fa-times mr-2" aria-hidden="true"></i>Below Average Rating
                </p>
              )}
              {restaurant.pricerange <= 4 ? (
                <p className="text-success my-0">
                  <i className="fa fa-check-square-o mr-2" aria-hidden="true"></i>Affordable Food
                </p>
              ) : (
                <p className="text-danger my-0">
                  <i className="fa fa-times mr-2" aria-hidden="true"></i>Expensive Food
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewRatingInput id={id} setRatings={setRatings} ratings={ratings} setRestaurant={setRestaurant} restaurant={restaurant} setRatingsCollection={setRatingsCollection} />
      <div className="restaurant-reviews-container mt-3">
        {ratings && (
          <>
            {ratings.map(review => {
              return <RestaurantReview key={review.id} review={review} setRatings={setRatings} ratings={ratings} setRestaurant={setRestaurant} restaurant={restaurant} setRatingsCollection={setRatingsCollection} />
            })}
            {isMoreRatings && (
              <>
                <div className="text-center mt-4">
                  <button className="admin-btn btn" onClick={() => setCounter(prev => prev + 4)}>
                    <i className="fa fa-stack-overflow mr-2" aria-hidden="true"></i> Load More Ratings
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {!ratings.length && <p className="text-center">This restaurant does not have any reviews.</p>}
      </div>
    </>
  )
}

export default RestaurantDetails
