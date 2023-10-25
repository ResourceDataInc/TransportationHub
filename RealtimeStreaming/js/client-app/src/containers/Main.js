import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { Status } from './Status';
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
                <div className='col-8'>
                    <RouteInputs/>
                </div>
            </div>
            <div className='row'>
                <div className='col-8'>
                    <Map/>
                </div>
                <div className='col-4'>
                    <Status/>
                </div> 
            </div>
        </div>
    )
};
