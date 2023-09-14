import { useSelector, useDispatch } from 'react-redux';
import { CloseCardIcon } from './CloseCardIcon';
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
        <div className='vehicle-stop-cards card h-100'>
            <CloseCardIcon 
                onClick={() => dispatch(clearSelectedStop()) }
            />
                
            <div className="card-body">
                <h4 className="card-title ">{stop.address}</h4>

                <hr></hr>
                
                <div>
                    <p className="card-text">Stop {stop.id}</p>
                    <p className="card-text">{stop.arrivalDelay !== null && `Last bus's arrival delay: ${stop.arrivalDelay} seconds`}</p>
                    <p className="card-text">{stop.departureDelay !== null && `Last bus's departure delay: ${stop.departureDelay} seconds`}</p>
                </div>
            </div>
        </div>
    )
};
