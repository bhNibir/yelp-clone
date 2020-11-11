import React, { useEffect, useState, useContext, useCallback } from 'react'
import * as _ from 'underscore'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AppContext from '../AppContext'
import StateContext from '../StateContext'
import SortRestaurants from './SortRestaurants'
import StarRating from './StarRating'
import HomeMap from './HomeMap'
import RestaurantContext from '../RestaurantContext'

function Home(props) {
  // Set up state
  const [isLoading, setIsLoading] = useState(true)
  const [restaurantCollection, setRestaurantCollection] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [counter, setCounter] = useState(10)
  const [sortCount, setSortCount] = useState(0)

  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)

  // Acquire restaurant data on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/restaurants')
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
        await axios.delete(`/restaurants/${id}`)
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
    return <div>Loading...</div>
  }

  return (
    <>
      <RestaurantContext.Provider value={{ restaurantCollection, sortCount }}>
        <HomeMap />
      </RestaurantContext.Provider>
      <h1>Restaurants List</h1>
      <SortRestaurants setRestaurants={setRestaurants} setSortCount={setSortCount} setRestaurantCollection={setRestaurantCollection} restaurantCollection={restaurantCollection} />
      <div>
        {restaurants.map(restaurant => {
          let dollarAmount = ''
          for (var i = 0; i < restaurant.pricerange; i++) {
            dollarAmount += '$'
          }
          return (
            <div key={restaurant.id}>
              <br />
              <div>Name: {restaurant.name}</div>
              <div>Description: {restaurant.description}</div>
              <div>Location: {restaurant.location}</div>
              <div>Price Range: {dollarAmount}</div>
              {restaurant.rating ? <StarRating rating={restaurant.rating} count={restaurant.count} /> : 'No Ratings'}
              <br />
              <Link to={`/restaurant/${restaurant.id}`}>View Details</Link>
              {state.loggedIn && (
                <>
                  <Link to={`/restaurant/${restaurant.id}/update`}>Edit Restaurant</Link>
                  <button onClick={() => handleDelete(restaurant.id)}>Delete Restaurant</button>
                </>
              )}
              <br />
            </div>
          )
        })}
      </div>
      {!restaurants.length && <h1>No Results found...</h1>}
      <br />
      <br />
      {/* {{isMoreResults && <button onClick={() => setCounter(prev => prev + 10)}>Load More Restaurants</button>}} */}
    </>
  )
}

export default Home
