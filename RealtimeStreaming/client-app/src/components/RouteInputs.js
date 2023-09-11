import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getRoute } from '../store/routes/routesActions';

export const RouteInputs = () => {
    const [routeIdInput, setRouteIdInput] = useState(0);
    const [directionIdInput, setDirectionIdInput] = useState(0);
    const dispatch = useDispatch();

    return (
        <div className=''>
            <form 
                onSubmit={ (e) => {
                    e.preventDefault();

                    const request = {
                        routeId: routeIdInput,
                        directionId: directionIdInput,
                    };

                    dispatch(getRoute(request));
                }}
            >
                <label htmlFor='routeIdInput'>Route ID:</label>
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

                <input type='submit'/>
            </form>
        </div>
    )
};
