import { Marker, Popup, Tooltip } from 'react-leaflet';
import { stopIcon } from '../assets/leafletIcons/stopIcon';

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
            <Marker 
                position={position} 
                icon={stopIcon}
            >
                <Tooltip>
                    <br></br>
                    <p>{address}</p>
                </Tooltip>
            </Marker>
        </div>
    )
};
