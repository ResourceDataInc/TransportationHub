import { getTripUpdates } from '../store/vehicles/vehiclesActions';
import { useDispatch, useSelector } from 'react-redux';
import { selectRouteId, selectDirectionId } from '../store/selection/selectionSlice';
import { selectVehicles, selectedVehicleUpdates, selectSelectedVehicleId } from '../store/vehicles/vehiclesSlice';
import { selectStops } from '../store/stops/stopsSlice';
import { useEffect } from 'react';
import Vehicle from '../models/vehicle';
import { updateInterval } from './Map';

function computeDelayText(delay){
    const seconds = delay % 60;
    const minutes = Math.round(delay/60);
    const delayPhrase = minutes >= 1 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    if(delay > 0) return <span className="text-danger">{delayPhrase}</span>;
    return <span className="text-success">{delayPhrase}</span>;
}

export const Status = () => {
    const dispatch = useDispatch();
    const routeId =  useSelector(selectRouteId);
    const directionId = useSelector(selectDirectionId);
    const updates = useSelector(selectedVehicleUpdates);
    const stops = useSelector(selectStops);
    const vehicles = useSelector(selectVehicles);
    const selectedVehicleId = useSelector(selectSelectedVehicleId);

    useEffect(() => {
        const request = {
            routeId: routeId,
            directionId: directionId,
        }
        const positionChangeInterval = setInterval(() => {
            dispatch(getTripUpdates(request));
        }, updateInterval);
        return () => clearInterval(positionChangeInterval);
    }, [dispatch, routeId, directionId]);
    const stopsMap = {};
    if(stops){
        for(let stop of stops){
            stopsMap[stop.row.columns[7]] = stop.row.columns[6]
        }
    }
    const vehiclesMap = {};
    
    let updateList = [];
    if(vehicles){
        for(let vehicleUnlabelled of vehicles){
            const vehicle = new Vehicle(vehicleUnlabelled);
            vehiclesMap[vehicle.id] = vehicle;  
        }
        for(let update of updates){
            if(update.id in vehiclesMap){
                const trStyle = selectedVehicleId == update.id ? {"background-color": 'yellow'} : null;
                updateList.push(<tr style={trStyle}>
                    <td>{update.id}</td>
                    <td>{vehiclesMap[update.id].status}</td>
                    <td>{vehiclesMap[update.id].stopId}</td>
                    <td>{stopsMap[update.sequence]}</td>
                    <td>{computeDelayText(update.arrivalDelay)}</td>
                </tr>);
            }
        }
    }
    let table;
    if(updateList.length > 0){
        table = <table>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Stop Id</th>
                    <th>Stop Name</th>
                    <th>Delay</th>
                </tr>
                {updateList} 
        </table>
    } 
   return (
        <div className='cards-container row'>
                <div className='col-12 h-50 py-1'>
                {table}
                </div> 
        </div>
    )
};
