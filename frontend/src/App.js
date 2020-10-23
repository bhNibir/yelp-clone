import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import Home from './components/Home'
import UpdateRestaurant from './components/UpdateRestaurant'
import RestaurantDetails from './components/RestaurantDetails'
import PageNotFound from './components/PageNotFound'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
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
  )
}

export default App
