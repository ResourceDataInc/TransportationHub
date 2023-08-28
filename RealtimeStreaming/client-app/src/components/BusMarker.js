import { Marker, Popup } from 'react-leaflet';
import { busIcon } from '../assets/leafletIcons/busIcon';
import { redBusIcon } from '../assets/leafletIcons/redBusIcon';
import { yellowBusIcon } from '../assets/leafletIcons/yellowBusIcon';
import { greenBusIcon } from '../assets/leafletIcons/greenBusIcon';
import { greyBusIcon } from '../assets/leafletIcons/greyBusIcon';

export const BusMarker = (props) => {
    const { bus, position, id, latitude, longitude } = props;

    const iconColor = () => {
        const busId = Number(id);

        if (busId > 4500) {
            return greenBusIcon;
        };

        if (busId > 4000) {
            return yellowBusIcon;
        };

        if (busId > 3500) {
            return redBusIcon;
        };

        return greyBusIcon;
    };

    return (
        <>
            <Marker position={position} icon={iconColor()}>
                <Popup>This is bus number {id}</Popup>
            </Marker>
        </>
    )
};
