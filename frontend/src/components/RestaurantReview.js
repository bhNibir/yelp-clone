import React, { useEffect, useState } from 'react'

function RestaurantReview(props) {
  const [review, setReview] = useState(props)
  return (
    <>
      <div>{review.rating}</div>
      <div>{review.name}</div>
      <div>{review.message}</div>
      <br />
    </>
  )
}

export default RestaurantReview
