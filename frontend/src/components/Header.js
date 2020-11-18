import React, { useEffect, useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Searchbar from './Searchbar'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function Header(props) {
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)
  const [page, setPage] = useState()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname == '/') {
      setPage('home')
    } else if (location.pathname == '/restaurant/create') {
      setPage('create')
    } else {
      setPage('')
    }
  }, [location.pathname])

  function switchView() {
    if (state.loggedIn) {
      dispatch({ type: 'Logout' })
    } else {
      dispatch({ type: 'Login' })
    }
  }
  return (
    <>
      <nav className="navbar navbar-expand-xl navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <i className="fa fa-ravelry" aria-hidden="true"></i>Yelp Clone
        </Link>
        <Searchbar />
        <button className="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ` + (page == 'home' ? 'active' : '')}>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {state.loggedIn && (
              <li className={`nav-item ` + (page == 'create' ? 'active' : '')}>
                <Link to="/restaurant/create" className="nav-link">
                  Create Restaurant
                </Link>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-light" onClick={switchView}>
                Switch View
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="home-header">
        <p>Click the switch button above to see the {state.loggedIn ? 'admin' : 'user'} view</p>
      </div>
    </>
  )
}

export default Header
