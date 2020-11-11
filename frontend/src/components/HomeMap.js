import React, { useEffect, useState, useContext } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import { useHistory } from 'react-router-dom'
import RestaurantContext from '../RestaurantContext'
import InfoWindowEx from './InfoWindowEx'

function MapContainer(props) {
  const { restaurantCollection, sortCount } = useContext(RestaurantContext)
  const [markers, setMarkers] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [rerender, setRerender] = useState(0)
  const history = useHistory()

  useEffect(() => {
    setMarkers(
      restaurantCollection.map(restaurant => {
        let lat = parseFloat(restaurant.latitude)
        let lng = parseFloat(restaurant.longtitude)
        return (
          <Marker
            key={restaurant.id}
            position={{ lat, lng }}
            onClick={() => {
              setSelectedMarker(restaurant)
            }}
          />
        )
      })
    )
  }, [restaurantCollection])

  // Rerenders the component to fix bug where info window was not appearing on first marker click
  useEffect(() => {
    setRerender(prev => prev + 1)
  }, [selectedMarker])

  function coords() {
    if (restaurantCollection.length) {
      return { lat: parseFloat(restaurantCollection[0].latitude), lng: parseFloat(restaurantCollection[0].longtitude) }
    } else {
      return { lat: 43.6532, lng: -79.3832 }
    }
  }

  // The following code initiates a new default center when a search is performed
  const [pastList, setPastList] = useState({
    length: restaurantCollection.length,
    firstItem: restaurantCollection[0]
  })
  const [pastSortCount, setPastSortCount] = useState(sortCount)

  const [key, setKey] = useState(0)
  useEffect(() => {
    if (restaurantCollection.length !== pastList.length) {
      setSelectedMarker(null)
      setKey(prev => prev + 1)
      setPastList({
        length: restaurantCollection.length,
        firstItem: restaurantCollection[0]
      })
    } else if (restaurantCollection[0] !== pastList.firstItem && sortCount === pastSortCount) {
      setSelectedMarker(null)
      setKey(prev => prev + 1)
      setPastList({
        length: restaurantCollection.length,
        firstItem: restaurantCollection[0]
      })
    }
    setPastSortCount(sortCount)
  }, [restaurantCollection])

  // Redirect
  function redirectRestaurantDetails(id) {
    history.push(`/restaurant/${id}`)
  }

  function zoomLevel() {
    if (restaurantCollection.length > 2) {
      return 9
    }
    return 11
  }

  const mapStyles = {
    width: '100%',
    height: '100%'
  }
  const containerStyle = {
    position: 'relative',
    height: '70vh',
    width: '100%'
  }

  return (
    <>
      <Map google={props.google} zoom={zoomLevel()} key={key} initialCenter={coords()} style={mapStyles} containerStyle={containerStyle}>
        {markers}
        {selectedMarker && (
          <InfoWindowEx
            onClose={() => setSelectedMarker(null)}
            position={{
              lat: parseFloat(selectedMarker.latitude),
              lng: parseFloat(selectedMarker.longtitude)
            }}
            visible={true}
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <button type="button" onClick={() => redirectRestaurantDetails(selectedMarker.id)}>
                View Details
              </button>
            </div>
          </InfoWindowEx>
        )}
      </Map>
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY}`
})(MapContainer)

/* import React, { useEffect, useState, useContext } from 'react'
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps'
import RestaurantContext from '../RestaurantContext'

function Map(props) {
  const { restaurantCollection } = useContext(RestaurantContext)
  const [markers, setMarkers] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)

  useEffect(() => {
    setMarkers(
      restaurantCollection.map(restaurant => {
        let lat = parseFloat(restaurant.latitude)
        let lng = parseFloat(restaurant.longtitude)
        return <Marker key={restaurant.id} position={{ lat, lng }} onClick={() => setSelectedMarker(restaurant)} />
      })
    )
  }, [restaurantCollection])

  function coords() {
    if (restaurantCollection.length) {
      return { lat: parseFloat(restaurantCollection[0].latitude), lng: parseFloat(restaurantCollection[0].longtitude) }
    } else {
      return { lat: 43.6532, lng: -79.3832 }
    }
  }

  return (
    <>
      <GoogleMap defaultZoom={10} defaultCenter={coords()}>
        {markers}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedMarker.latitude),
              lng: parseFloat(selectedMarker.longtitude)
            }}
            onCloseClick={() => {
              setSelectedMarker(null)
            }}
          >
            <div>{selectedMarker.name}</div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

function HomeMap(props) {
  const { restaurantCollection, sortCount } = useContext(RestaurantContext)
  const [pastList, setPastList] = useState({
    length: restaurantCollection.length,
    firstItem: restaurantCollection[0]
  })
  const [pastSortCount, setPastSortCount] = useState(sortCount)

  const [key, setKey] = useState(0)
  useEffect(() => {
    if (restaurantCollection.length !== pastList.length) {
      setKey(prev => prev + 1)
      setPastList({
        length: restaurantCollection.length,
        firstItem: restaurantCollection[0]
      })
    } else if (restaurantCollection[0] !== pastList.firstItem && sortCount === pastSortCount) {
      setKey(prev => prev + 1)
      setPastList({
        length: restaurantCollection.length,
        firstItem: restaurantCollection[0]
      })
    }
    setPastSortCount(sortCount)
  }, [restaurantCollection])
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WrappedMap key={key} googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY}`} loadingElement={<div style={{ height: '100%' }} />} containerElement={<div style={{ height: '100%' }} />} mapElement={<div style={{ height: '100%' }} />} />
    </div>
  )
}

export default HomeMap */
