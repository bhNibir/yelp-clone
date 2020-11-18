import React, { useEffect, useState, useContext, useCallback } from 'react'
import * as _ from 'underscore'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import AppContext from '../AppContext'
import StateContext from '../StateContext'
import SortRestaurants from './SortRestaurants'
import StarRating from './StarRating'
import HomeMap from './HomeMap'
import RestaurantContext from '../RestaurantContext'
import PageLoader from './PageLoader'

function Home(props) {
  // Set up state
  const [isLoading, setIsLoading] = useState(true)
  const [restaurantCollection, setRestaurantCollection] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [counter, setCounter] = useState(10)
  const [sortCount, setSortCount] = useState(0)

  let history = useHistory()
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  // Acquire restaurant data on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/restaurants')
        setRestaurantCollection(response.data)
        setRestaurants(response.data.slice(0, 10))
        setIsLoading(false)
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: 'Server is temporarily down. Please try again later.', color: 'error' })
      }
    }
    fetchData()
  }, [])

  // Handles Delete Button Click
  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (confirm) {
      try {
        await axios.delete(`/api/restaurants/${id}`)
        setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id))
        setRestaurantCollection(prev => prev.filter(restaurant => restaurant.id !== id))
        dispatch({ type: 'FlashMessage', value: 'Restaurant was successfully deleted!', color: 'success' })
      } catch (err) {
        dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
      }
    }
  }

  // Loads more restuarants when scrolled to bottom of screen
  const triggerMoreRestaurants = useCallback(() => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
      setCounter(prev => prev + 10)
    }
  }, [])

  // Throttles scroll event
  const handleScrollEvent = useCallback(_.throttle(triggerMoreRestaurants, 200), [])

  // Adds scroll event listener to trigger infinite load functionality
  useEffect(() => {
    window.addEventListener('scroll', handleScrollEvent)
    return () => window.removeEventListener('scroll', handleScrollEvent)
  }, [restaurantCollection])

  // Handles Load More Button Functionality
  useEffect(() => {
    setRestaurants(restaurantCollection.slice(0, counter))
    if (restaurantCollection.length && counter >= restaurantCollection.length) {
      window.removeEventListener('scroll', handleScrollEvent)
    }
  }, [counter])

  // Send back loading page until data has been retrieved
  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <RestaurantContext.Provider value={{ restaurantCollection, sortCount }}>
        <div>
          <div className="home-map-info">
            {restaurants && (
              <>
                {restaurants.map(restaurant => {
                  let dollarAmount = ''
                  for (var i = 0; i < restaurant.pricerange; i++) {
                    dollarAmount += '$'
                  }
                  return (
                    <div key={restaurant.id} className="border p-2 google-maps-result">
                      <div className="d-flex justify-content-between mt-1 mb-0">
                        <h4 className="my-0">{restaurant.name}</h4>
                        <div className="mr-1 mt-1">{restaurant.rating ? <StarRating rating={restaurant.rating} /> : 'No Ratings'}</div>
                      </div>
                      <p className="m-0 mt-1">
                        {restaurant.street}, <br /> {restaurant.city}, {restaurant.province}, {restaurant.country}
                      </p>
                      <div>
                        <Link to={`/restaurant/${restaurant.id}`}>View Details</Link>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
          <HomeMap />
        </div>
      </RestaurantContext.Provider>
      <SortRestaurants setRestaurants={setRestaurants} setSortCount={setSortCount} setRestaurantCollection={setRestaurantCollection} restaurantCollection={restaurantCollection} />
      <div className="restaurant-list-container">
        {restaurants && (
          <>
            {restaurants.map(restaurant => {
              let dollarAmount = ''
              for (var i = 0; i < restaurant.pricerange; i++) {
                dollarAmount += '$'
              }
              return (
                <div key={restaurant.id} className="restaurant-list-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3 className="restaurant-list-item-title mb-0">{restaurant.name}</h3>
                      <div>Price: {dollarAmount}</div>
                      <p className="text-left mb-0">
                        {restaurant.street}, <br /> {restaurant.city}, {restaurant.province}, {restaurant.country}
                      </p>
                      <div>
                        <Link to={`/restaurant/${restaurant.id}`}>View Details</Link>
                      </div>
                    </div>
                    <div>
                      <div>{restaurant.rating ? <StarRating rating={restaurant.rating} count={restaurant.count} /> : 'No Ratings'}</div>
                      {state.loggedIn && (
                        <div className="text-right" style={{ transform: 'translateX(-10%)' }}>
                          <Link to={`/restaurant/${restaurant.id}/update`} className="btn btn-outline-secondary my-1 edit-btn">
                            <i className="fa fa-pencil mr-1" aria-hidden="true"></i> Edit
                          </Link>
                          <br />
                          <button onClick={() => handleDelete(restaurant.id)} className="btn btn-outline-secondary my-1 delete-btn">
                            <i className="fa fa-trash-o mr-1" aria-hidden="true"></i> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
      {!restaurants.length && <h1>No Results found...</h1>}
      {/* {{isMoreResults && <button onClick={() => setCounter(prev => prev + 10)}>Load More Restaurants</button>}} */}
    </>
  )
}

export default Home
