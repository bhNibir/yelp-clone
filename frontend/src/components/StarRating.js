import React, { useEffect, useState } from 'react'

function StarRating({ rating, count }) {
  const [stars, setStars] = useState()
  useEffect(() => {
    let starsList = []
    let num = parseFloat(rating)
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        starsList.push(<i key={i} className="fa fa-star gold" aria-hidden="true"></i>)
      } else if (i - 0.5 <= num) {
        starsList.push(<i key={i} className="fa fa-star-half-o gold" aria-hidden="true"></i>)
      } else {
        starsList.push(<i key={i} className="fa fa-star-o gold" aria-hidden="true"></i>)
      }
    }
    setStars(starsList)
  }, [rating])

  function getCount() {
    if (count == 1) {
      return `(${count} Review)`
    } else {
      return `(${count} Reviews)`
    }
  }

  return (
    <>
      {stars}{' '}
      {count && (
        <>
          <br /> {getCount()}
        </>
      )}
    </>
  )
}

export default StarRating
