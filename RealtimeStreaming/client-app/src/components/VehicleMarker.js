import { Marker, Popup } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { yellowBusIcon } from '../assets/leafletIcons/yellowBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';

export const VehicleMarker = ({ vehicle }) => {
    const {
        id,
        position,
        status,
        stopId,
    } = vehicle;

    const iconColor = () => {
        switch (status) {
            case 'IN_TRANSIT_TO':
                return greenBusIcon;
            case 'STOPPED_AT':
                return redBusIcon;
            case '':
                return greenBusIcon;
            default: 
                return greyBusIcon;
        };
    };

    return (
        <div>
            <Marker 
                position={position} 
                icon={iconColor()} 
            >
                <Popup>
                    <p>This is bus number {id}</p>
                    <p>{status === 'IN_TRANSIT_TO' && `Currently in transit to stop ${stopId}`}</p>
                    <p>{status === 'STOPPED_AT' && `Currently sitting at stop ${stopId}`}</p>
                </Popup>
            </Marker>
        </div>
    )
};
