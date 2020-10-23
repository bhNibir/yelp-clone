import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../AppContext'

function Header(props) {
  const dispatch = useContext(AppContext)

  function ClickFunc() {
    dispatch({ type: 'FlashMessage', value: 'Added!', color: 'success' })
  }

  return (
    <>
      <div className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <button onClick={ClickFunc}>Click me</button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Header
