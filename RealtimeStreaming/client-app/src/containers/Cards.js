import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VehicleCard } from '../components/VehicleCard';
import { StopCard } from '../components/StopCard';
import { selectVehicleCard, selectStopCard } from '../store/display/displaySlice';

export const Cards = () => {
    const vehicleCard = useSelector(selectVehicleCard);
    const stopCard = useSelector(selectStopCard);
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
                <div className='col-12'>
                    <VehicleCard/>
                </div> 
            }
            {displayStopCard && 
                <div className='col-12'>
                    <StopCard/>
                </div> 
            }
        </div>
    )
};
