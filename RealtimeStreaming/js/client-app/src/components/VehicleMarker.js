import { Marker, Popup } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedVehicleId, setSelectedVehicleId, setSelectedVehicle } from '../store/vehicles/vehiclesSlice';

export const VehicleMarker = ({ vehicle }) => {
    const {
        id,
        position,
        status,
    } = vehicle;

    const selectedVehicleId = useSelector(selectSelectedVehicleId)
    const dispatch = useDispatch();

    const iconColorAndSize = () => {
        let iconSize;
        if (selectedVehicleId === id) {
            iconSize = 27;
        } else {
            iconSize = 17;
        };

        switch (status) {
            case 'IN_TRANSIT_TO':
                return greenBusIcon(iconSize);
            case 'STOPPED_AT':
                return redBusIcon(iconSize);
            case '':
                return greenBusIcon(iconSize);
            default: 
                return greyBusIcon(iconSize);
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
                icon={iconColorAndSize()} 
                eventHandlers={markerEvents}
            >
                {/* <Popup>
                    <p>This is vehicle number {id}</p>
                </Popup> */}
            </Marker>
        </div>
    )
};
