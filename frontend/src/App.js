import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import Home from './components/Home'
import UpdateRestaurant from './components/UpdateRestaurant'
import RestaurantDetails from './components/RestaurantDetails'
import PageNotFound from './components/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/restaurant/:id" exact>
          <RestaurantDetails />
        </Route>
        <Route path="/restaurant/update/:id">
          <UpdateRestaurant />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
