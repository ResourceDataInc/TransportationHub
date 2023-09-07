import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectStopCard } from '../store/display/displaySlice';

export const StopCard = () => {
    const stop = useSelector(selectStopCard)

    return (
        <div className='card'>
            <img className="card-img-top" src='...' alt="Card image cap"/>
            <div className="card-body">
                <h5 className="card-title">Stop {stop.id}</h5>
                <p className="card-text">{stop.address}</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    )
};
