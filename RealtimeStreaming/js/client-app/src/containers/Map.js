import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { VehicleMarker } from '../components/VehicleMarker';
import { StopMarker } from '../components/StopMarker';
import { RouteLine } from '../components/RouteLine';
import { OfficeMarker } from '../components/OfficeMarker';
import { selectVehicles, setSelectedVehicle } from '../store/vehicles/vehiclesSlice';
import { getVehicles } from '../store/vehicles/vehiclesActions';
import { selectStops, setSelectedStop } from '../store/stops/stopsSlice';
import { selectRouteId, selectDirectionId } from '../store/selection/selectionSlice'
import Vehicle from '../models/vehicle';
import Stop from '../models/stop';
import L from 'leaflet';
import { selectRouteCenter, routeSelectedComplete } from '../store/routes/routesSlice';


function UpdateMapCenter({ mapCenter, centeringOn}) {
    const map = useMap(); 
    if(centeringOn) map.panTo([mapCenter.lat, mapCenter.lng], map.getZoom());
    return null;
}

// Leaflet Default Marker Setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export const updateInterval = 5000;

export const Map = () => {
    const pdxCenter = {lat: 45.5139, lng: -122.67923}; 
    const dispatch = useDispatch();
    const vehicles = useSelector(selectVehicles);
    const stops = useSelector(selectStops);
    const routeId =  useSelector(selectRouteId);
    const directionId = useSelector(selectDirectionId);

    const routeCenter = useSelector(selectRouteCenter);
    const routeSelected = useSelector(routeSelectedComplete);
    const [changedCoords, setChangedCoords] = useState(pdxCenter);
    const [clickPan, setClickPan] = useState(false);
    let useCenter;
    if(clickPan) useCenter=changedCoords;     
    else if(routeSelected) useCenter=routeCenter;
    const panEvent = routeSelected || clickPan; 

    useEffect(() => {
        const request = {
            routeId: routeId,
            directionId: directionId,
        }
        const positionChangeInterval = setInterval(() => {
            dispatch(getVehicles(request));
            dispatch(setSelectedVehicle());
            dispatch(setSelectedStop());
        }, updateInterval);

        return () => clearInterval(positionChangeInterval);
    }, [dispatch, routeId, directionId]);

    return (
        <div className='row'>
            <div className='col-12'>
                <MapContainer
                    id="main-map"
                    center={[pdxCenter.lat, pdxCenter.lng]}
                    zoom={12}
                    scrollWheelZoom={true}
                    className='map-container mx-auto border border-dark'
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a target="_blank" href="https://icons8.com/icon/86288/bus">Bus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {vehicles.map((vehicle) => {
                        const vehicleInstance = new Vehicle(vehicle);
                        return (
                            <VehicleMarker
                                key={`${vehicleInstance.id}`}
                                vehicle={vehicleInstance}
                                centerChanger={setChangedCoords}
                                clickNotifier={setClickPan}
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
                    <UpdateMapCenter mapCenter={useCenter} centeringOn={panEvent} />
                </MapContainer>
            </div>
        </div>
    )
};
