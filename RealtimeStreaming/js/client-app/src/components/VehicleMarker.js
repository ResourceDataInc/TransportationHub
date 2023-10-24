import { Tooltip } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedVehicleId, setSelectedVehicleId, setSelectedVehicle} from '../store/vehicles/vehiclesSlice';
import { RotatedMarker } from './RotatedMarker'

export const VehicleMarker = ({ vehicle }) => {
    const {
        id,
        position,
        status,
        bearing,
        stopId,
        stopSequence,
        directionId,
    } = vehicle;
    const selectedVehicleId = useSelector(selectSelectedVehicleId)
    const dispatch = useDispatch();
    const iconColorAndSize = () => {
        let iconSize;
        if (selectedVehicleId === id) {
            iconSize = 30;
        } else {
            iconSize = 20;
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
    const rotationAngle = (bearing-90).toString();
    return ( <div>
            <RotatedMarker
                position={position}
                icon={iconColorAndSize()}
                eventHandlers={markerEvents}
                rotationAngle={rotationAngle}
                rotationOrigin='center center'
            >

            <Tooltip>
                <br></br>
                <p>{id}: {status} {stopId}</p>
            </Tooltip>
            </RotatedMarker>
        </div>
    )
};
