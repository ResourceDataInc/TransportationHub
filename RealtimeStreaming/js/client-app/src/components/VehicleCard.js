import { useSelector, useDispatch } from 'react-redux';
import { CloseCardIcon } from './CloseCardIcon';
import { selectSelectedVehicle, clearSelectedVehicle, selectedVehicleUpdates } from '../store/vehicles/vehiclesSlice';
import { getVehicleUpdates } from '../store/vehicles/vehiclesActions';
import { selectStops } from '../store/stops/stopsSlice';
import Vehicle from '../models/vehicle';
import { useEffect } from 'react';

function delayToMessage(seedMessage = "", delay = 0){
    let message=seedMessage+" ON TIME";
    if(!delay) return message;
    else{
        if(delay > 0) message = seedMessage+" DELAYED "+delay+"s";
        else{
            if(delay < 0) message = seedMessage+" AHEAD "+delay+"s";
            else message = seedMessage + " ON TIME";
        }
    }
    return message;
}

export const VehicleCard = () => {
    const dispatch = useDispatch();
    const selectedVehicle = useSelector(selectSelectedVehicle);
    const updates = useSelector(selectedVehicleUpdates);
    const stops = useSelector(selectStops);
    const vehicle = selectedVehicle ? new Vehicle(selectedVehicle) : null;
    const stopSequence = vehicle ? vehicle.stopSequence : null;
    useEffect(() => {
        if(stopSequence){
            const vehicle = new Vehicle(selectedVehicle);
            const stopSequence = vehicle.stopSequence;
         console.log(stopSequence);
        const condition = vehicle.directionId == 0 ? ">=" : "<=";
        const request = {id: vehicle.id, stopSequence: vehicle.stopSequence, condition};
        dispatch(getVehicleUpdates(request));
        }
    }, [dispatch, stopSequence]);
    if(!vehicle || !stops) return;
    const stopsMap = {};
    for(let stop of stops){
        stopsMap[stop.row.columns[7]] = stop.row.columns[6]
    }

    const stopIdMap = {}
    for(let stop of stops){
        stopIdMap[stop.row.columns[3]] = stop.row.columns[6]
    }


    let updatesDisplayed = [];
    for (const update of updates) {
        const {sequence, arrivalDelay, departureDelay, ts} = update;
        if(((arrivalDelay != 0 && arrivalDelay) || (departureDelay && departureDelay != 0)) && sequence in stopsMap){
            const arrivalMessage = delayToMessage("ARRIVAL", arrivalDelay);
            const departureMessage = delayToMessage("DEPARTURE", departureDelay);
            updatesDisplayed.push(<li key='${sequence}'>{stopsMap[sequence]}: {arrivalMessage} {departureMessage}</li>);
        }
    }
    return (
        <div className='vehicle-stop-cards card h-180'>
            <CloseCardIcon
                onClick={() => dispatch(clearSelectedVehicle())}
            />
            <div className="card-body">
                <h4 className="card-title">Vehicle {vehicle.id}</h4>

                <hr></hr>
               <div>
                    {vehicle.status === 'IN_TRANSIT_TO' && <p><span className='text-success'>Currently in transit to </span><span className='font-weight-bold'>{stopIdMap[vehicle.stopId]}</span></p>}
                    {vehicle.status === '' && <p><span className='text-success'>Currently in transit to </span><span className='font-weight-bold'>{stopIdMap[vehicle.stopId]}</span></p>}
                    {vehicle.status === 'STOPPED_AT' && <p><span className='text-danger'>Currently sitting at </span><span className='font-weight-bold'>{stopIdMap[vehicle.stopId]}</span></p>}

                    <p>Route Number: <span className='font-weight-bold'>{vehicle.routeId}</span></p>
                </div>
                <div>
                    <ul>{updatesDisplayed}</ul>
                </div>
             </div>
        </div>
    )
};
