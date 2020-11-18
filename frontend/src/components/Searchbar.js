import React, { useEffect, useState, useCallback, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'
import { Link } from 'react-router-dom'

function Searchbar(props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const dispatch = useContext(AppContext)
  let timer

  const fetchResults = async () => {
    try {
      let response = await axios.get(`/api/query/${searchQuery}`)
      if (response.data.length) {
        setSearchResults(response.data)
      } else {
        setSearchResults([])
      }
      setSearchLoading(false)
    } catch (err) {
      dispatch({ type: 'FlashMessage', value: err.response.data, color: 'error' })
    }
  }

  // Hides search results if click is made anywhere on the page, other than on the input field
  const handleHideResults = useCallback(e => {
    if (e.target !== document.querySelector('.search-input')) {
      setShowResults(false)
    }
  }, [])

  // Sets event listener whenever results are shown & removes the results when a click is made anywhere on the page
  useEffect(() => {
    if (showResults) {
      document.addEventListener('click', handleHideResults)
    }
    return () => document.removeEventListener('click', handleHideResults)
  }, [showResults])

  useEffect(() => {
    if (searchQuery.length) {
      setSearchLoading(true)
      timer = setTimeout(fetchResults, 300)
    } else {
      setSearchLoading(false)
      setSearchResults([])
    }
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="nav-search">
      {searchLoading && <div className="loader"></div>}
      <div className="search-icon">
        <i className="fa fa-search" aria-hidden="true"></i>
      </div>
      <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.currentTarget.value)} onClick={() => setShowResults(true)} />
      {showResults && searchResults.length > 0 && (
        <>
          <div className="search-results-decoration"></div>
          <ul className="search-results">
            {searchResults.map(result => {
              return <SingleSearchResult key={result.id} {...result} setSearchQuery={setSearchQuery} />
            })}
          </ul>
        </>
      )}
    </div>
  )
}

function SingleSearchResult(props) {
  return (
    <li className="search-result">
      <Link to={`/restaurant/${props.id}`} className="search-result-link" onClick={() => props.setSearchQuery('')}>
        <h6 className="search-result-name">{props.name}</h6>
        <p className="search-result-address">
          {props.city}, {props.province}, {props.country}
        </p>
      </Link>
    </li>
  )
}

export default Searchbar
