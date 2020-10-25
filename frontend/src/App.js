import React, { useReducer } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import Home from './components/Home'
import UpdateRestaurant from './components/UpdateRestaurant'
import RestaurantDetails from './components/RestaurantDetails'
import PageNotFound from './components/PageNotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import FlashMessage from './components/FlashMessage'
import AppContext from './AppContext'
import CreateRestaurantPage from './components/CreateRestaurantPage'

function App() {
  const initialState = {
    flashMessages: [],
    loggedIn: false
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FlashMessage':
        return { ...state, flashMessages: state.flashMessages.concat({ message: action.value, color: action.color }) }
      case 'Login':
        return { ...state, loggedIn: true }
      case 'Logout':
        return { ...state, loggedIn: false }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={dispatch}>
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
    </AppContext.Provider>
  )
}

export default App
