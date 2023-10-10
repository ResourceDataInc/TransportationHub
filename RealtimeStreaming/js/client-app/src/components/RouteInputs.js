import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedRouteId, clearSelectedRouteId } from '../store/vehicles/vehiclesSlice';
import { clearRouteData } from '../store/routes/routesSlice';
import { getRoute } from '../store/routes/routesActions';

function getRoutes(){
    const columns = new Map();
    columns.set("route_id",0);
    columns.set("route_long_name", 1);
    const columns_sql = Array.from(columns.keys()).join(",");
    let data = {
        "ksql": `SELECT ${columns_sql} FROM RoutesTable;`,
        "streamsProperties": {}
    }
    let json_array;
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if(xhr.status >=200 && xhr.status < 300) json_array = JSON.parse(xhr.responseText);
    }
    xhr.open('POST','http://localhost:8088/query', false);
    xhr.setRequestHeader("accept",'application/vnd.ksql.v1+json');
    xhr.send(JSON.stringify(data));
    json_array.shift();
    const output_data = []
    for (let record of json_array) {
        output_data.push(
            {
                id: record.row.columns[columns.get("route_id")],
                name: record.row.columns[columns.get("route_long_name")]
            });
    }
    return output_data;
}

export const RouteInputs = () => {
    const [routeIdInput, setRouteIdInput] = useState('0');
    const [directionIdInput, setDirectionIdInput] = useState('0');
    const dispatch = useDispatch();
    const routes = getRoutes();
    let route_input_menu = []
    let options = []
    for(let route of routes){
        options.push(<option value={route.id}>{route.id}: {route.name}</option>)
    }
    route_input_menu.push(<label htmlFor='routes'>Route:</label>);
    route_input_menu.push(<select
        className='mx-2'
        type='number'
        id='routeIdInput'
        name='routeIdInput'
        form='interactive'
        onChange={ (e) => {e.preventDefault(); setRouteIdInput(e.target.value) }}>{options}</select>);
    return (
        <div className=''>
            <form id='interactive'>
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
                    onChange={ (e) => setDirectionIdInput(e.target.value) }
                >
                <option value='0'>inbound</option>
                <option value='1'>outbound</option>
                </select>
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
