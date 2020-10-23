import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Header(props) {
  return (
    <>
      <div className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Header
