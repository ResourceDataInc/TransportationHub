import { useSelector } from 'react-redux';
import { Polyline } from 'react-leaflet';
import { selectSelectedRouteId, selectSelectedRoutePositions } from '../store/routes/routesSlice';

export const RouteLine = () => {
    const selectedRouteId = useSelector(selectSelectedRouteId);
    const selectedRoutePositions = useSelector(selectSelectedRoutePositions);

    const pathOptions = {
        color: 'red',
    };

    if (selectedRouteId === 0 || selectedRouteId === null) {
        return;
    };

    return (
        <Polyline
            positions={selectedRoutePositions}
            pathOptions={pathOptions}
        ></Polyline>
    )
};
