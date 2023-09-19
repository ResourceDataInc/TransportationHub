import { useSelector, useDispatch } from 'react-redux';
import { CloseCardIcon } from './CloseCardIcon';
import { selectSelectedVehicle, clearSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import Vehicle from '../models/vehicle';

export const VehicleCard = () => {
    const dispatch = useDispatch();
    const selectedVehicle = useSelector(selectSelectedVehicle);
    let vehicle;

    if (selectedVehicle) {
        vehicle = new Vehicle(selectedVehicle);
    } else {
        return;
    };

    return (
        <div className='vehicle-stop-cards card h-100'>
            <CloseCardIcon 
                onClick={ () => dispatch(clearSelectedVehicle()) }
            />
            <div className="card-body">
                <h4 className="card-title">Vehicle {vehicle.id}</h4>

                <hr></hr>

                <div>
                    {vehicle.status === 'IN_TRANSIT_TO' && <p><span className='text-success'>Currently in transit to stop </span>{vehicle.stopId}</p>}
                    {vehicle.status === '' && <p><span className='text-success'>Currently in transit to stop </span>{vehicle.stopId}</p>}
                    {vehicle.status === 'STOPPED_AT' && <p><span className='text-danger'>Currently sitting at stop </span>{vehicle.stopId}</p>}
                    
                    <p>Latitude: {vehicle.latitude}</p>
                    <p>Longitude: {vehicle.longitude}</p>
                </div>
            </div>
        </div>
    )
};
