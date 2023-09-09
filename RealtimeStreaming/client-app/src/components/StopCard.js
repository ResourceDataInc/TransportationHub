import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedStop, clearSelectedStop } from '../store/stops/stopsSlice';
import Stop from '../models/stop';

export const StopCard = () => {
    const dispatch = useDispatch();
    const selectedStop = useSelector(selectSelectedStop);
    let stop;

    if (selectedStop) {
        stop = new Stop(selectedStop);
    } else {
        return;
    };

    return (
        <div className='card h-100'>
            
            <button 
                className='btn-danger'
                onClick={ () => dispatch(clearSelectedStop()) }
            >Close</button>

            <div className="card-body">
                <h5 className="card-title">Stop {stop.id}</h5>
                
                <p className="card-text">{stop.address}</p>
                <p className="card-text">{stop.arrivalDelay !== null && `Last bus's arrival delay: ${stop.arrivalDelay} seconds`}</p>
                <p className="card-text">{stop.departureDelay !== null && `Last bus's departure delay: ${stop.departureDelay} seconds`}</p>
            </div>
        </div>
    )
};
