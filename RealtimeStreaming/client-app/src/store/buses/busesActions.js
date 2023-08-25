import { createAsyncThunk } from '@reduxjs/toolkit';

export const getVehiclePositions = createAsyncThunk(
    'buses/getVehiclePositions',
    async (vehiclePositionApiInstance) => {
        const response = await vehiclePositionApiInstance.getRecords();
        return response;
    }
);
