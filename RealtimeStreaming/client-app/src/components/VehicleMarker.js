import { Marker, Popup } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { yellowBusIcon } from '../assets/leafletIcons/yellowBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';
import { useDispatch } from 'react-redux';
import { setSelectedVehicleId, setSelectedVehicle } from '../store/vehicles/vehiclesSlice';

export const VehicleMarker = ({ vehicle }) => {
    const {
        id,
        position,
        status,
        stopId,
    } = vehicle;

    const dispatch = useDispatch();

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

    const updateCard = () => {
        dispatch(setSelectedVehicleId(id));
        dispatch(setSelectedVehicle());
    };

    const markerEvents = {
        click: () => {
            updateCard();
        },
    };

    return (
        <div>
            <Marker 
                position={position} 
                icon={iconColor()} 
                eventHandlers={markerEvents}
            >
                <Popup>
                    <p>This is vehicle number {id}</p>
                </Popup>
            </Marker>
        </div>
    )
};
