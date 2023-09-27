import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedRouteId, clearSelectedRouteId } from '../store/vehicles/vehiclesSlice';
import { clearRouteData } from '../store/routes/routesSlice';
import { getRoute } from '../store/routes/routesActions';

export const RouteInputs = () => {
    const [routeIdInput, setRouteIdInput] = useState('0');
    const [directionIdInput, setDirectionIdInput] = useState('0');
    const dispatch = useDispatch();

    return (
        <div className=''>
            <form>
                <label htmlFor='routeIdInput'>Route Number:</label>
                <input
                    className='mx-2'
                    type='number'
                    min='0'
                    id='routeIdInput'
                    name='routeIdInput'
                    value={routeIdInput}
                    onChange={ (e) => setRouteIdInput(e.target.value) }
                />

                <label htmlFor='directionIdInput'>Direction ID:</label>
                <input
                    className='mx-2'
                    type='number'
                    min='0'
                    max='1'
                    id='directionIdInput'
                    name='directionIdInput'
                    value={directionIdInput}
                    onChange={ (e) => setDirectionIdInput(e.target.value) }
                />

                <button
                    className='mr-2'
                    onClick={(e) => {
                        e.preventDefault();
                        
                        dispatch(setSelectedRouteId(routeIdInput));
                        
                        const request = {
                            routeId: routeIdInput,
                            directionId: directionIdInput,
                        };
                        
                        dispatch(getRoute(request));
                    }}
                >Submit</button>

                <button 
                    onClick={(e) => {
                        e.preventDefault();

                        setRouteIdInput('0');
                        setDirectionIdInput('0');
                        dispatch(clearSelectedRouteId());
                        dispatch(clearRouteData());
                    }}
                >Clear</button>
            </form>
        </div>
    )
};
