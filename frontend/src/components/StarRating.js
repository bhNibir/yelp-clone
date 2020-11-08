import React, { useEffect, useState } from 'react'

function StarRating({ rating }) {
  const [stars, setStars] = useState()
  useEffect(() => {
    let starsList = []
    let num = parseFloat(rating)
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        starsList.push(<i className="fas fa-star"></i>)
      } else if (i - 0.5 <= num) {
        starsList.push(<i className="fas fa-star-half-alt"></i>)
      } else {
        starsList.push(<i className="far fa-star"></i>)
      }
    }
    setStars(starsList)
  }, [])
  return <>{stars}</>
}

export default StarRating
