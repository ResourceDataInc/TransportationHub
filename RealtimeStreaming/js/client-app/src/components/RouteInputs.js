import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection, clearSelection } from '../store/selection/selectionSlice'
import { clearRouteData } from '../store/routes/routesSlice';
import { getRoute } from '../store/routes/routesActions';
import { getAllStops } from '../store/stops/stopsActions'
import { getVehicles } from '../store/vehicles/vehiclesActions';

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
    const routes = getRoutes();
    const initial_route_id = routes[0].id;
    const [routeIdInput, setRouteIdInput] = useState(initial_route_id);
    const [directionIdInput, setDirectionIdInput] = useState('0');
    const dispatch = useDispatch();

    let route_input_menu = []
    let options = []
    for(let route of routes) options.push(<option value={route.id}>{route.id}: {route.name}</option>);
    route_input_menu.push(<label htmlFor='routes'>Route:</label>);
    route_input_menu.push(<select
        className='mx-2'
        type='number'
        id='routeIdInput'
        name='routeIdInput'
        form='interactive'>{options}</select>);

    function submit_interactive(e){
         const request = {
             routeId: routeIdInput,
             directionId: directionIdInput,
         };
         if(e.target.id === "directionIdInput") {
             setDirectionIdInput(e.target.value);
             request.directionId=e.target.value;
         }
         if(e.target.id === "routeIdInput"){
             setRouteIdInput(e.target.value);
             request.routeId=e.target.value;
         }
         dispatch(setSelection(request));
         dispatch(getAllStops(request))
         dispatch(getRoute(request));
         dispatch(getVehicles(request));
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
                <option value='0'selected>inbound</option>
                <option value='1'>outbound</option>
                </select>
            </form>
        </div>
    )
};
