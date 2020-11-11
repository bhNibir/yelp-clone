import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function PageNotFound(props) {
  return (
    <>
      <h1>404 Error</h1>
      <div>Page not found</div>
      <Link to="/">Return Home</Link>
    </>
  )
}

export default PageNotFound
