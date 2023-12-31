import { Tooltip, useMap } from 'react-leaflet';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedVehicleId, setSelectedVehicleId, setSelectedVehicle, clearSelectedVehicle} from '../store/vehicles/vehiclesSlice';
import { RotatedMarker } from './RotatedMarker'

export const VehicleMarker = ({ vehicle, centerChanger, clickNotifier }) => {
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
    const changeCenter = () => centerChanger({lat: position[0], lng: position[1]});
    const markerEvents = {
        mouseover: () => {
            dispatch(setSelectedVehicleId(id));
            dispatch(setSelectedVehicle());
        },
        click: () => {
            centerChanger({lat: position[0], lng: position[1]});
            clickNotifier(true);
            setTimeout(()=> {
                clickNotifier(false);
            },50);
        }
    };
    
    const rotationAngle = (bearing-90).toString();
    return ( <div>
            <RotatedMarker
                position={position}
                icon={iconColorAndSize()}
                rotationAngle={rotationAngle}
                rotationOrigin='center center'
                eventHandlers={markerEvents}
            >
            <Tooltip>
                <br></br>
                <p>{id}</p>
            </Tooltip>
            </RotatedMarker>
        </div>
    )
};
