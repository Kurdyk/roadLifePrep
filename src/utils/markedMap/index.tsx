import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { MarkedMapComponentProps } from './type'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

const MarkedMapComponent: React.FC<MarkedMapComponentProps> = ({id, markers, lines, center, canInteract, defaultZoom}) => {

    return (
        <MapContainer id={id} className="MapContainer" center={center} zoom={defaultZoom} scrollWheelZoom={canInteract}
            zoomControl={canInteract} attributionControl = {true} doubleClickZoom={canInteract} dragging={canInteract}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {/* Set markers */}
            <Box className="MapMarkers">
                {markers?.map(({position, text, id, icon, link, interactive}) => {
                    return (
                        <Marker position={position} icon={icon} key={id} interactive={interactive}>
                            <Popup closeButton={false}>
                                <Link to={link!}>{text}</Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Box>

            {/* Set lines */}
            <Box className="MapLines">
                {lines?.map(({startPosition, endPosition, color, id}) => {
                    return <Polyline positions={[startPosition, endPosition]} color={color} key={id}/>
                })}
            </Box>
            {/* Recenter map */}
        </MapContainer>
  )
}

export default MarkedMapComponent