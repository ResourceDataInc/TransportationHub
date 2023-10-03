import { Marker } from 'react-leaflet';
import { xIcon } from '../assets/leafletIcons/xicon';

export const OfficeMarker = () => {
    return (
        <div>
            <Marker 
                position={[45.520543, -122.684610]} 
                icon={xIcon(22)} 
            >
                
            </Marker>
        </div>
    )
};