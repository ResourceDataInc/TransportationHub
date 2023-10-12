import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { Cards } from './Cards';
import { useSelector } from 'react-redux';
import { selectSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import { selectSelectedStop } from '../store/stops/stopsSlice';
import { RouteInputs } from '../components/RouteInputs';

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
        <div>
            <div className='row'>
                <div className={displayCard ? 'col-9' : 'col-12'}>
                    <RouteInputs/>
                </div>
            </div>
            <div className='row'>
                <div className={displayCard ? 'col-9' : 'col-12'}>
                    <Map/>
                </div>
                <div className={displayCard ? 'col-3': ''}>
                    <Cards/>
                </div> 
            </div>
        </div>
    )
};
