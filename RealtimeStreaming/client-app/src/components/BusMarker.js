import { Marker, Popup } from 'react-leaflet';
import { busIcon } from '../assets/leafletIcons/busIcon';

export const BusMarker = (props) => {
    const { bus, position } = props;

    return (
        <>
            <Marker position={position} icon={busIcon}>
                <Popup>This is bus number {bus.row.columns[0]}</Popup>
            </Marker>
        </>
    )
};
