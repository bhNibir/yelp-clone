import React, { useEffect, useState, useContext } from 'react'
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

export default HomeMap
