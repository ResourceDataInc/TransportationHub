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
