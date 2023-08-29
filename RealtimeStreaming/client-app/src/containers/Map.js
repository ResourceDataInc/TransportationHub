import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VehicleMarker } from '../components/VehicleMarker';
import { StopMarker } from '../components/StopMarker';
import { selectVehicles } from '../store/vehicles/vehiclesSlice';
import { getVehicles } from '../store/vehicles/vehiclesActions';
import { selectStops } from '../store//stops/stopsSlice';
import { getStops } from '../store/stops/stopsActions';

// Leaflet Imports and Setup
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
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

    useEffect(() => {
        const postionChangeInterval = setInterval(() => {
            dispatch(getVehicles());
        }, 1000);

        return () => clearInterval(postionChangeInterval);
    }, []); 

    useEffect(() => {
        dispatch(getStops())
    }, []);
    
    return (
        <div className='row'>
            <div className='col-12'>
                <MapContainer
                    center={[45.517, -122.683]}
                    zoom={14}
                    scrollWheelZoom={true}
                    className='map-container mx-auto border border-dark'
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {vehicles.map((vehicle) => {
                        return (
                            <VehicleMarker
                                key={`${vehicle.row.columns[0]}`}
                                vehicle={vehicle}
                                position={[vehicle.row.columns[1], vehicle.row.columns[2]]}
                                id={vehicle.row.columns[0]}
                                latitude={vehicle.row.columns[1]}
                                longitude={vehicle.row.columns[2]}
                                status={vehicle.row.columns[3]}
                                currentOrNextStop={vehicle.row.columns[4]}
                            />
                        )
                    })}
                    
                    { stops.map((stop) => {
                        return (
                            <StopMarker
                                key={`${stop.row.columns[0]}`}
                                stop={stop}
                                position={[stop.row.columns[4], stop.row.columns[5]]}
                                latitude={stop.row.columns[4]}
                                longitude={stop.row.columns[5]}
                                address={stop.row.columns[6]}
                            />
                        )
                    })}
                    
                </MapContainer>
                
                <p className='w-75 mx-auto text-right'>
                    <a target="_blank" href="https://icons8.com/icon/86288/bus">Bus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
                    <span>, </span>
                    <a target="_blank" href="https://icons8.com/icon/123616/square">Square</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
                </p>

            </div>
        </div>
    )
};
