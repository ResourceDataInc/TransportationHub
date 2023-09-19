import { CircleMarker, Tooltip } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedStopId, setSelectedStopId, setSelectedStop } from '../store/stops/stopsSlice';

export const StopMarker = ({ stop }) => {
    const { 
        id,
        position, 
        address,
    } = stop;

    const selectedStopId = useSelector(selectSelectedStopId)
    const dispatch = useDispatch();
    
    let radius = 4
    const pathOptions = {
        color: 'black',
        weight: 1.5,
        fillColor: 'lightGrey',
        fillOpacity: 1,
    };

    if (selectedStopId === id) {
        radius = 7;
        pathOptions.fillColor = 'red';
    }
    
    const updateCard = () => {
        dispatch(setSelectedStopId(id));
        dispatch(setSelectedStop());
    };

    const markerEvents = {
        click: () => {
            updateCard();
        },
    };

    return (
        <CircleMarker
            center={position}
            radius={radius}
            pathOptions={pathOptions}
            eventHandlers={markerEvents}
        >
            <Tooltip>
                <br></br>
                <p>{address}</p>
            </Tooltip>
        </CircleMarker>
    );
};
