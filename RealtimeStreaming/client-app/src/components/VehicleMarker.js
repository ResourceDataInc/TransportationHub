import { Marker, Popup } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { yellowBusIcon } from '../assets/leafletIcons/yellowBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';

export const VehicleMarker = (props) => {
    const { 
        vehicle, 
        position, 
        id, 
        latitude, 
        longitude, 
        status, 
        currentOrNextStop, 
    } = props;

    const iconColor = () => {
        if (status === 'IN_TRANSIT_TO') {
            return greenBusIcon;
        };

        if (status === 'STOPPED_AT') {
            return redBusIcon;
        };

        if (status === '') {
            return yellowBusIcon;
        };

        return greyBusIcon;
    };

    return (
        <div>
            <Marker position={position} icon={iconColor()}>
                <Popup>
                    <p>This is bus number {id}</p>
                    <p>{status === 'IN_TRANSIT_TO' && `Currently in transit to stop ${currentOrNextStop}`}</p>
                    <p>{status === 'STOPPED_AT' && `Currently sitting at stop ${currentOrNextStop}`}</p>
                </Popup>
            </Marker>
        </div>
    )
};
