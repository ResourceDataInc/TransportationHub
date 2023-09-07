import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectVehicleCard } from '../store/display/displaySlice';

export const VehicleCard = () => {
    const vehicle = useSelector(selectVehicleCard)

    return (
        <div className='card'>
            <img className="card-img-top" src='...' alt="Card image cap"/>
            <div className="card-body">
                <h5 className="card-title">Vehicle {vehicle.id}</h5>
                <p className="card-text">{vehicle.status}</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    )
};

