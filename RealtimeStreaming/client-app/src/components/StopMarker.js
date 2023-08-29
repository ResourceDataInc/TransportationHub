import { Marker, Popup } from 'react-leaflet';
import { blueStopIcon } from '../assets/leafletIcons/blueStopIcon';

export const StopMarker = (props) => {
    const { 
        stop, 
        position, 
        latitude, 
        longitude, 
        address,  
    } = props;

    return (
        <div>
            <Marker position={position} icon={blueStopIcon}>
                <Popup>
                    <p>{address}</p>
                </Popup>
            </Marker>
        </div>
    )
};
