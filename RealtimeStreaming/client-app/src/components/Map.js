import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BusMarker } from './BusMarker';
import { selectBuses } from '../store/buses/busesSlice';
import { getVehiclePositions } from '../store/buses/busesActions';

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
    const buses = useSelector(selectBuses);

    useEffect(() => {
        const postionChangeInterval = setInterval(() => {
            dispatch(getVehiclePositions());
        }, 1000);

        return () => clearInterval(postionChangeInterval);
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
                    {buses.map((bus) => {
                        return (
                            <BusMarker
                                key={`${bus.row.columns[0]}`}
                                bus={bus}
                                position={[bus.row.columns[1], bus.row.columns[2]]}
                                id={bus.row.columns[0]}
                                latitude={bus.row.columns[1]}
                                longitude={bus.row.columns[2]}
                            />
                        )
                    })}
                </MapContainer>
                
                <p className='w-75 mx-auto text-right'>
                    <a target="_blank" href="https://icons8.com/icon/86288/bus">Bus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
                </p>
            </div>
        </div>
    )
};
