import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VehicleCard } from '../components/VehicleCard';
import { StopCard } from '../components/StopCard';
import { selectSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import { selectSelectedStop } from '../store/stops/stopsSlice';

export const Cards = () => {
    const vehicleCard = useSelector(selectSelectedVehicle);
    const stopCard = useSelector(selectSelectedStop);
    const [displayVehicleCard, setDisplayVehicleCard] = useState(false);
    const [displayStopCard, setDisplayStopCard] = useState(false);

    useEffect(() => {
        if (!vehicleCard) {
            setDisplayVehicleCard(false);
        } else {
            setDisplayVehicleCard(true);
        }; 
        
        if (!stopCard) {
            setDisplayStopCard(false);
        } else {
            setDisplayStopCard(true);
        }; 
    }, [vehicleCard, stopCard]);

    return (
        <div className='cards-container row'>
            {displayVehicleCard && 
                <div className='col-12 h-50 py-2'>
                    <VehicleCard/>
                </div> 
            }
            {displayStopCard && 
                <div className='col-12 h-50 py-2'>
                    <StopCard/>
                </div> 
            }
        </div>
    )
};
