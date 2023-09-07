import React, { useState } from 'react';
import { CircleMarker, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setStopCard } from '../store/display/displaySlice';

export const StopMarker = ({ stop }) => {
    const { 
        id,
        latitude,
        longitude,
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
    
    const markerEvents = {
        click: () => {
            const stopPayload = {
                id,
                latitude,
                longitude,
                position, 
                address,
            };
            dispatch(setStopCard(stopPayload));
        }
    };

    const [zoom, setZoom] = useState(14);
    const [northBound, setNorthBound] = useState();
    const [eastBound, setEastBound] = useState();
    const [southBound, setSouthBound] = useState();
    const [westBound, setWestBound] = useState();
    
    const setMapBounds = (newMapBounds) => {
        const newNorthBound = newMapBounds._northEast.lat;
        setNorthBound(newNorthBound);

        const newEastBound = newMapBounds._northEast.lng;
        setEastBound(newEastBound)

        const newSouthBound = newMapBounds._southWest.lat;
        setSouthBound(newSouthBound)

        const newWestBound = newMapBounds._southWest.lng;
        setWestBound(newWestBound)
    };

    const map = useMapEvents({
        load() {
            const newMapBounds = map.getBounds();
            setMapBounds(newMapBounds);
        },
        
        move() {
            const newMapBounds = map.getBounds();
            setMapBounds(newMapBounds);
        },

        zoom() {
            const newMapBounds = map.getBounds();
            setMapBounds(newMapBounds);
        
            const newZoom = map.getZoom();
            setZoom(newZoom)
        },
    });

    if (zoom <= 14) {
        return;
    };

    if (latitude > northBound || latitude < southBound) {
        return;
    };

    if (longitude > eastBound || longitude < westBound) {
        return;
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
                <p>Stop Id: {id}</p>
            </Tooltip>
        </CircleMarker>
    );
};
