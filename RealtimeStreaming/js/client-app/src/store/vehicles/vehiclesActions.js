import { createAsyncThunk } from '@reduxjs/toolkit';
import { VehiclesApi } from '../../api/VehiclesApi';

export const getVehicles = createAsyncThunk(
    'buses/getVehicles',
    async () => {
        const api = new VehiclesApi();
        const data = await api.getVehicles();
        return data;
    }
);

export const getVehiclesOnRoute = createAsyncThunk(
    'buses/getVehiclesOnRoute',
    async (routeId) => {
        const api = new VehiclesApi();
        const data = await api.getVehiclesOnRoute(routeId);
        return data;
    }
);

