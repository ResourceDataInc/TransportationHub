import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection } from '../store/selection/selectionSlice'
import { getRoute, getAllRoutes } from '../store/routes/routesActions';
import { selectAllRoutes, setRouteSelected } from '../store/routes/routesSlice';
import { getAllStops } from '../store/stops/stopsActions'
import { getVehicles } from '../store/vehicles/vehiclesActions';

export const RouteInputs = () => {
    const [routeIdInput, setRouteIdInput] = useState('0');
    const [directionIdInput, setDirectionIdInput] = useState('0');
    const [colorInput, setColorInput] = useState('red');
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllRoutes());
   }, [dispatch]);
    const routes = useSelector(selectAllRoutes);

    let route_input_menu = []
    let options = []
    options.push(<option value='' key='default'></option>);
    for (let route of routes) {
        const combinedValue = route.id + ":" + route.color;
        options.push(<option value={combinedValue} key={combinedValue}>
            {route.id}: {route.name}
        </option>);
    }
    route_input_menu.push(<label htmlFor='routes'>Route:</label>);
    route_input_menu.push(<select
        className='mx-2'
        type='number'
        id='routeInput'
        name='routeInput'
        form='interactive'>{options}</select>);
    function submit_interactive(e) {
        const request = {
            routeId: routeIdInput,
            directionId: directionIdInput,
            color: colorInput,
        };
        if (e.target.id === "directionIdInput") {
            setDirectionIdInput(e.target.value);
            request.directionId = e.target.value;
        }
        if (e.target.id === "routeInput") {
            const values = e.target.value.split(":")
            const routeId = values[0];
            const color = '#' + values[1];
            setRouteIdInput(routeId);
            setColorInput(color);
            request.routeId = routeId;
            request.color = color;
        }
        dispatch(setSelection(request));
        dispatch(getAllStops(request));
        dispatch(getRoute(request));
        dispatch(getVehicles(request));
        setTimeout(() => {
            dispatch(setRouteSelected(false));
        }, 1000);
     }
    return (
        <div className=''>
            <form id='interactive' onChange={submit_interactive}>
                {route_input_menu}
                <label htmlFor='directionIdInput'>Direction ID:</label>
                <select
                    className='mx-2'
                    type='number'
                    min='0'
                    max='1'
                    id='directionIdInput'
                    name='directionIdInput'
                    form='interactive'
                >
                    <option value='0'>0</option>
                    <option value='1'>1</option>
                </select>
            </form>
        </div>
    )
};
