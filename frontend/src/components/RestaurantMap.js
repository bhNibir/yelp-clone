import React, { useEffect } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

function RestaurantMap(props) {
  const { restaurant } = props
  const coords = { lat: restaurant.latitude, lng: restaurant.longtitude }

  const mapStyles = {
    width: '100%',
    height: '100%'
  }
  const containerStyle = {
    position: 'relative',
    height: '400px',
    width: '400px'
  }

  return (
    <>
      <Map google={props.google} zoom={14} initialCenter={coords} style={mapStyles} containerStyle={containerStyle} disableDefaultUI={true} zoomControl={true} streetViewControl={true}>
        <Marker position={coords} />
      </Map>
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCcbP47PnbbLWJ4T9GdciB5LCrFSSIP-EA`
})(RestaurantMap)
