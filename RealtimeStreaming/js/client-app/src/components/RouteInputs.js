import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection, clearSelection } from '../store/selection/selectionSlice'
import { clearRouteData } from '../store/routes/routesSlice';
import { getRoute } from '../store/routes/routesActions';
import { getAllStops } from '../store/stops/stopsActions'
import { getVehicles } from '../store/vehicles/vehiclesActions';

function sqlRequest(query){
    let data = {
        "ksql": query,
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
    return json_array;
}

function getRoutes(){
    const columns = new Map();
    columns.set("route_id",0);
    columns.set("route_long_name", 1);
    columns.set("route_color", 2);
    const columns_sql = Array.from(columns.keys()).join(",");
    const query = `SELECT ${columns_sql} FROM RoutesTable;`;
    const routes = sqlRequest(query);
    const output_data = []
    for (let record of routes) {
        output_data.push(
            {
                id: record.row.columns[columns.get("route_id")],
                name: record.row.columns[columns.get("route_long_name")],
                color: record.row.columns[columns.get("route_color")],
            });
    }
    return output_data;
}

export const RouteInputs = () => {
    const routes = getRoutes();
    const initialRouteId = routes[0].id;
    const initialColor = routes[0].color;
    const [routeIdInput, setRouteIdInput] = useState(initialRouteId);
    const [directionIdInput, setDirectionIdInput] = useState('0');
    const [colorInput, setColorInput] = useState(initialColor);
    const dispatch = useDispatch();

    let route_input_menu = []
    let options = []
    options.push(<option value=''></option>);
    for(let route of routes) {
        const combinedValue = route.id+":"+route.color;
        options.push(<option value={combinedValue}>{route.id}: {route.name}</option>);
    }
    route_input_menu.push(<label htmlFor='routes'>Route:</label>);
    route_input_menu.push(<select
        className='mx-2'
        type='number'
        id='routeInput'
        name='routeInput'
        form='interactive'>{options}</select>);
    function submit_interactive(e){
         const request = {
             routeId: routeIdInput,
             directionId: directionIdInput,
             color: colorInput,
         };
         if(e.target.id === "directionIdInput") {
             setDirectionIdInput(e.target.value);
             request.directionId=e.target.value;
         }
         if(e.target.id === "routeInput"){
             const values = e.target.value.split(":")
             const routeId = values[0];
             const color = '#'+values[1];
             setRouteIdInput(routeId);
             setColorInput(color);
             request.routeId=routeId;
             request.color=color;
         }
         dispatch(setSelection(request));
         dispatch(getAllStops(request));
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
