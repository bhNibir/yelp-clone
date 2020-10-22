import React from 'react'
import Axios from 'axios'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import Home from './components/Home'

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact>
        <Home />
      </Route>
    </BrowserRouter>
  )
}

export default App
