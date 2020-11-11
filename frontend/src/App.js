import React, { useReducer } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import AppContext from './AppContext'
import StateContext from './StateContext'

// Components
import Home from './components/Home'
import UpdateRestaurant from './components/UpdateRestaurant'
import RestaurantDetails from './components/RestaurantDetails'
import PageNotFound from './components/PageNotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessage from './components/FlashMessage'
import CreateRestaurantPage from './components/CreateRestaurantPage'

function App() {
  const initialState = {
    flashMessages: [],
    loggedIn: Boolean(localStorage.getItem('yelp-admin'))
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FlashMessage':
        return { ...state, flashMessages: state.flashMessages.concat({ message: action.value, color: action.color }) }
      case 'Login':
        localStorage.setItem('yelp-admin', true)
        return { ...state, loggedIn: true }
      case 'Logout':
        localStorage.removeItem('yelp-admin')
        return { ...state, loggedIn: false }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          <Header />
          <FlashMessage state={state} />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/restaurant/create">
              <CreateRestaurantPage />
            </Route>
            <Route path="/restaurant/:id" exact>
              <RestaurantDetails />
            </Route>
            <Route path="/restaurant/:id/update">
              <UpdateRestaurant />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </StateContext.Provider>
    </AppContext.Provider>
  )
}

export default App
