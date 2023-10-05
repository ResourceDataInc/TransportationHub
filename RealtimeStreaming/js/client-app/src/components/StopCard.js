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

    const arrivalDelayText = () => {
        if (stop.arrivalDelay >= 0 ) {
            return `Last bus arrived ${stop.arrivalDelay} seconds late`;
        } else {
            const earlyArrival = stop.arrivalDelay * -1;
            return `Last bus arrived ${earlyArrival} seconds early`;
        };
    };

    return (
        <div className='vehicle-stop-cards card h-100'>
            <CloseCardIcon 
                onClick={ () => dispatch(clearSelectedStop()) }
            />
                
            <div className="card-body">
                <h4 className="card-title ">{stop.address}</h4>

                <hr></hr>
                
                <div>
                    <p className="card-text">Stop ID: <span className='font-weight-bold'>{stop.id}</span></p>
                    <br></br>
                    
                    {/* <p className="card-text">{stop.arrivalDelay !== null && arrivalDelayText()}</p>
                    <p className="card-text">{stop.departureDelay !== null && `Last bus's departure delay: ${stop.departureDelay} seconds`}</p> */}

                    {stop.arrivalDelay >= 0 && <p><span className='text-danger'>Last bus was late by: </span><span className='font-weight-bold'>{stop.arrivalDelay} seconds</span></p>}
                    {stop.arrivalDelay < 0 && <p><span className='text-success'>Last bus was early by: </span><span className='font-weight-bold'>{stop.arrivalDelay * -1} seconds</span></p>}
                </div>
            </div>
        </div>
    )
};
