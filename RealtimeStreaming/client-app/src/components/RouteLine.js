import { useSelector } from 'react-redux';
import { Polyline } from 'react-leaflet';
import { selectSelectedRoutePositions } from '../store/routes/routesSlice';

export const RouteLine = () => {
    const selectedRoutePositions = useSelector(selectSelectedRoutePositions);

    const pathOptions = {
        color: 'red',
    };

    return (
        <Polyline
            positions={selectedRoutePositions}
            pathOptions={pathOptions}
        ></Polyline>
    )
};
