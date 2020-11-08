import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Searchbar from './Searchbar'
import AppContext from '../AppContext'
import StateContext from '../StateContext'

function Header(props) {
  const dispatch = useContext(AppContext)
  const state = useContext(StateContext)
  function switchView() {
    if (state.loggedIn) {
      dispatch({ type: 'Logout' })
    } else {
      dispatch({ type: 'Login' })
    }
  }
  return (
    <>
      <div className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {state.loggedIn && (
            <li className="nav-item">
              <Link to="/restaurant/create" className="nav-link">
                Create Restaurant
              </Link>
            </li>
          )}
          <li className="nav-item">
            <button className="nav-link" onClick={switchView}>
              Switch to Admin
            </button>
          </li>
        </ul>
        <Searchbar />
      </div>
    </>
  )
}

export default Header
