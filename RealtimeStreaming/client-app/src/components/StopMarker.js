import React, { useState } from 'react';
import { CircleMarker, Tooltip, useMapEvents } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setSelectedStopId, setSelectedStop } from '../store/stops/stopsSlice';

export const StopMarker = ({ stop }) => {
    const { 
        id,
        position, 
        address,
    } = stop;

    const dispatch = useDispatch();
    
    const radius = 4;
    const pathOptions = {
        color: 'black',
        weight: 1.5,
        fillColor: 'lightGrey',
        fillOpacity: 1,
    };
    
    const updateCard = () => {
        dispatch(setSelectedStopId(id));
        dispatch(setSelectedStop());
    };

    const markerEvents = {
        click: () => {
            updateCard();
        },
    };

    // Only Show Stops When Zoomed In //
    const [zoom, setZoom] = useState(14);

    const map = useMapEvents({
        zoom() {
            const newZoom = map.getZoom();
            setZoom(newZoom)
        },
    });

    if (zoom <= 14) {
        return;
    };
    // Only Show Stops When Zoomed In //

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
