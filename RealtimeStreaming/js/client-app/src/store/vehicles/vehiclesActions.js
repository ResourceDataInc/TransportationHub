import { createAsyncThunk } from '@reduxjs/toolkit';
import { VehiclesApi } from '../../api/VehiclesApi';

export const getVehicles = createAsyncThunk(
    'buses/getVehicles',
    async (request) => {
        const api = new VehiclesApi();
        const data = await api.getVehicles(request);
        return data;
    }
);
export const getTripUpdates = createAsyncThunk(
    'buses/getTripUpdates',
    async (request) => {
        const api = new VehiclesApi();
        const data = await api.getTripUpdates(request);
        return data;
    }
);