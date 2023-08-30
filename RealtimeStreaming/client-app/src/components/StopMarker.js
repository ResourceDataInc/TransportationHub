import { CircleMarker, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';

export const StopMarker = (props) => {
    const { 
        stop, 
        position, 
        latitude, 
        longitude, 
        address,
        stopSequence,
        stopId,
    } = props;

    const radius = 4;
    
    const pathOptions = {
        color: 'black',
        weight: 1.5,
        fillColor: 'lightGrey',
        fillOpacity: 1,
    };

    const map = useMapEvents({
        zoom() {
            const zoom = map.getZoom()
        },
    });

    return (
        <CircleMarker
            center={position}
            radius={radius}
            pathOptions={pathOptions}
        >
            <Tooltip>
                <br></br>
                <p>{address}</p>
                <p>Stop Id: {stopId}</p>
            </Tooltip>
        </CircleMarker>
    )
};
