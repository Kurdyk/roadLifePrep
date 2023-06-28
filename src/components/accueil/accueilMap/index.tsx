import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { accueilMarkers, greenIcon } from './const'

const AccueilMapComponent: React.FC = () => {
  return (
        <MapContainer id="mapAccueil" center={[48.866667, 2.333333]} zoom={15} scrollWheelZoom={false} zoomControl={false} 
        attributionControl = {true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Set markers */}
            {accueilMarkers?.map((position, index) => {
                if (position === undefined) {
                    return <></>
                }
                return (
                    <Marker position={position} icon={greenIcon} key={index}/> // The list is constant so using index as key shouldn't matter
                )
            })}
        </MapContainer>
  )
}

export default AccueilMapComponent;