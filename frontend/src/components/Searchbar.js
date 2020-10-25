import React, { useEffect, useState, useCallback, useContext } from 'react'
import axios from 'axios'
import AppContext from '../AppContext'
import { Link } from 'react-router-dom'

function Searchbar(props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const dispatch = useContext(AppContext)
  let timer

  const fetchResults = async () => {
    try {
      let response = await axios.get(`/query/${searchQuery}`)
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
    <>
      <div>{searchLoading && <h3>Loading...</h3>}</div>
      <input type="text" placeholder="Search for restaurant..." value={searchQuery} onChange={e => setSearchQuery(e.currentTarget.value)} />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map(result => {
            return <SingleSearchResult key={result.id} {...result} setSearchResults={setSearchResults} />
          })}
        </ul>
      )}
    </>
  )
}

function SingleSearchResult(props) {
  return (
    <li>
      <Link to={`/restaurant/${props.id}`} onClick={() => props.setSearchResults(false)}>
        <div>{props.name}</div>
      </Link>
    </li>
  )
}

export default Searchbar
