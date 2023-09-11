import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { Cards } from './Cards';
import { RouteInputs } from '../components/RouteInputs';
import { useSelector } from 'react-redux';
import { selectSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import { selectSelectedStop } from '../store/stops/stopsSlice';

export const Main = () => {
    const vehicleCard = useSelector(selectSelectedVehicle);
    const stopCard = useSelector(selectSelectedStop);
    const [displayCard, setDisplayCard] = useState(false);

    useEffect(() => {
        if (!vehicleCard && !stopCard) {
            setDisplayCard(false);
        } else {
            setDisplayCard(true);
        };
    }, [vehicleCard, stopCard]);

    return (
        <div className='row'>
            <div className='col-12'>
                <RouteInputs/>
            </div>
            <div className={displayCard ? 'col-9' : 'col-12'}>
                <Map/>
            </div>
            <div className={displayCard ? 'col-3': ''}>
                <Cards/>
            </div> 
        </div>
    )
};
