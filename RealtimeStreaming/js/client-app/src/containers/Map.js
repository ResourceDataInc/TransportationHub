import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer } from 'react-leaflet';
import { VehicleMarker } from '../components/VehicleMarker';
import { StopMarker } from '../components/StopMarker';
import { RouteLine } from '../components/RouteLine';
import { OfficeMarker } from '../components/OfficeMarker';
import { SetMapProperties } from '../components/SetMapProperties';
import { selectVehicles, setSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import { getVehicles } from '../store/vehicles/vehiclesActions';
import { selectStops, setSelectedStop } from '../store/stops/stopsSlice';
import { selectRouteId, selectDirectionId } from '../store/selection/selectionSlice'
import Vehicle from '../models/vehicle';
import Stop from '../models/stop';

// Leaflet Default Marker Setup
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export const Map = () => {
    const dispatch = useDispatch();
    const vehicles = useSelector(selectVehicles);
    const stops = useSelector(selectStops);
    const routeId =  useSelector(selectRouteId);
    const directionId = useSelector(selectDirectionId);
    useEffect(() => {
        const request = {
            routeId: routeId,
            directionId: directionId,
        }
        const positionChangeInterval = setInterval(() => {
            dispatch(getVehicles(request));
            dispatch(setSelectedVehicle());
            dispatch(setSelectedStop());
        }, 1000);

        return () => clearInterval(positionChangeInterval);
    }, [dispatch, routeId, directionId]);

    return (
        <div className='row'>
            <div className='col-12'>
                <MapContainer
                    id="main-map"
                    center={[47.879, -122.238]}
                    zoom={10}
                    scrollWheelZoom={true}
                    className='map-container mx-auto border border-dark'
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a target="_blank" href="https://icons8.com/icon/86288/bus">Bus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <SetMapProperties/>

                    {vehicles.map((vehicle) => {
                        const vehicleInstance = new Vehicle(vehicle);
                        return (
                            <VehicleMarker
                                key={`${vehicleInstance.id}`}
                                vehicle={vehicleInstance}
                            />
                        )
                    })}

                    {stops.map((stop) => {
                        const stopInstance = new Stop(stop);
                        return (
                            <StopMarker
                                key={`stop-${stopInstance.index}`}
                                stop={stopInstance}
                            />
                        )
                    })}

                    <RouteLine />
                    <OfficeMarker/>
                </MapContainer>
            </div>
        </div>
    )
};
