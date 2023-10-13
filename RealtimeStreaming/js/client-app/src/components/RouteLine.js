import { useSelector } from 'react-redux';
import { Polyline } from 'react-leaflet';
import { selectSelectedRouteId, selectSelectedRoutePositions } from '../store/routes/routesSlice';
import { selectRouteColor } from '../store/selection/selectionSlice'
export const RouteLine = () => {
    const selectedRouteId = useSelector(selectSelectedRouteId);
    const selectedRoutePositions = useSelector(selectSelectedRoutePositions);
    const selectedColor = useSelector(selectRouteColor)
    const pathOptions = {
        color: selectedColor,
    };

    if (selectedRouteId === '0' || selectedRouteId === null) {
        return;
    };

    return (
        <Polyline
            positions={selectedRoutePositions}
            pathOptions={pathOptions}
        ></Polyline>
    )
};
