import React, { useEffect, useState } from 'react'

function StarRating({ rating }) {
  const [stars, setStars] = useState()
  useEffect(() => {
    let starsList = []
    let num = parseFloat(rating)
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        starsList.push(<i class="fa fa-star" aria-hidden="true"></i>)
      } else if (i - 0.5 <= num) {
        starsList.push(<i class="fa fa-star-half-o" aria-hidden="true"></i>)
      } else {
        starsList.push(<i class="fa fa-star-o" aria-hidden="true"></i>)
      }
    }
    setStars(starsList)
  }, [rating])
  return <>{stars}</>
}

export default StarRating
