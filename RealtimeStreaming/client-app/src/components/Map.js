import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BusMarker } from './BusMarker';
import { selectBuses } from '../store/buses/busesSlice';
import { getVehiclePositions } from '../store/buses/busesActions';
import { VehiclePositionApi } from '../api/vehiclePositionApi';

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
    const [moveThatBus, setMoveThatBus] = useState(false);
    const buses = useSelector(selectBuses);
    const api = new VehiclePositionApi();

    const setupConsumerInstance = async () => {
        try{
            await api.createInstance();
            await api.subscribe();

            setMoveThatBus(true);
        } catch(e) {
            setMoveThatBus(false);
        };     
    };

    useEffect(() => {
        setupConsumerInstance();
    }, []);

    const changePosition = () => {
        if (moveThatBus) {
            //dispatch(getVehiclePositions(api))
        }
    };

    useEffect(() => {
        const postionChangeInterval = setInterval(() => {
            changePosition();
        }, 3000);

        return () => clearInterval(postionChangeInterval);
    }, [moveThatBus]); 
    
    return (
        <div className='row'>
            {/*
            <div className='col-12'>
                <button
                    onClick={() => setTestingMoveThatBus(!testingMoveThatBus)}
                    className={`text-light mb-2 ${testingMoveThatBus ? "bg-danger" : "bg-success"}`}
                >Move That Bus? &#40;AKA Loop Get Records&#41;</button>
            </div> 
            */}

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
                                key={`${bus.key}`}
                                bus={bus}
                                position={[bus.value.LATITUDE, bus.value.LONGITUDE]}
                            />
                        )
                    })}
                </MapContainer>

                <p className='w-75 mx-auto text-right'><a target="_blank" href="https://icons8.com/icon/86308/bus">Bus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
            </div>
        </div>
    )
};
