import { createAsyncThunk } from '@reduxjs/toolkit';
import { VehiclePositionApi } from '../../api/vehiclePositionApi';

export const getVehiclePositions = createAsyncThunk(
    'buses/getVehiclePositions',
    async () => {
        const api = new VehiclePositionApi();
        const data = await api.getRecords();
        return data;
    }
);
