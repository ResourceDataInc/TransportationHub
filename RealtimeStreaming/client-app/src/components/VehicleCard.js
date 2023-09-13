import { useSelector, useDispatch } from 'react-redux';
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
        <div className='card h-100'>
            
            <button 
                className='btn-danger'
                onClick={() => {
                    dispatch(clearSelectedVehicle());
                }}
            >Close</button>

            <div className="card-body">
                <h5 className="card-title">Vehicle {vehicle.id}</h5>

                {vehicle.status === 'IN_TRANSIT_TO' && <p><span className='text-success'>Currently in transit to stop </span>{vehicle.stopId}</p>}
                {vehicle.status === '' && <p><span className='text-success'>Currently in transit to stop </span>{vehicle.stopId}</p>}
                {vehicle.status === 'STOPPED_AT' && <p><span className='text-danger'>Currently sitting at stop </span>{vehicle.stopId}</p>}
                
                <p>Latitude: {vehicle.latitude}</p>
                <p>Longitude: {vehicle.longitude}</p>
            </div>
        </div>
    )
};
