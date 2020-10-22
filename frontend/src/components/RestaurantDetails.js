import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function RestaurantDetails(props) {
  const { id } = useParams()

  return (
    <>
      <div>You are viewing the page for {id}</div>
    </>
  )
}

export default RestaurantDetails
