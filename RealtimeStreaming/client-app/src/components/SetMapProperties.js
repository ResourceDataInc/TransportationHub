import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMapEvents } from 'react-leaflet';
import { getStopsWithinMapBounds } from '../store/stops/stopsActions';

export const SetMapProperties = () => {
    const [northBound, setNorthBound] = useState();
    const [eastBound, setEastBound] = useState();
    const [southBound, setSouthBound] = useState();
    const [westBound, setWestBound] = useState();
    const [zoom, setZoom] = useState(14);
    const dispatch = useDispatch();

     const setMapBounds = (newMapBounds) => {
         const newNorthBound = newMapBounds._northEast.lat;
         setNorthBound(newNorthBound);
         
         const newEastBound = newMapBounds._northEast.lng;
         setEastBound(newEastBound);
         
         const newSouthBound = newMapBounds._southWest.lat;
         setSouthBound(newSouthBound); 
         
         const newWestBound = newMapBounds._southWest.lng;
         setWestBound(newWestBound);
     };

    const map = useMapEvents({
        move() {
            const newMapBounds = map.getBounds();
            setMapBounds(newMapBounds);
        },
    });
    
    useEffect(() => {
        const stopsChangeInterval = setInterval(() => {
            const bounds = {
                north: northBound, 
                east: eastBound, 
                south: southBound, 
                west: westBound,
            };

            dispatch(getStopsWithinMapBounds(bounds));
        }, 1000);

        return () => clearInterval(stopsChangeInterval);
    }, [northBound, eastBound, southBound, westBound]); 

    return (
        <></>
    )
};
