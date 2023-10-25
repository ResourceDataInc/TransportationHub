import { createSlice } from '@reduxjs/toolkit';
import { getVehicles, getTripUpdates } from './vehiclesActions';

const options = {
    name: 'vehicles',
    initialState: {
        vehicles: [{
            row: {
                columns: [
                    4949,               // [0] VEHICLE_ID: String
                    45.517,             // [1] LATITUDE: Double
                    -122.683,           // [2] LONGITUDE: Double
                    'IN_TRANSIT_TO',    // [3] CURRENT_STATUS: String
                    5,                  // [4] CURRENT_STOP_SEQUENCE: BigInt
                    '8374',             // [5] STOP_ID: String
                    '90',               // [6] ROUTE_ID: String
                    '0',                // [7] DIRECTION_ID: BigInt
                    1694712350,         // [8] TIMESTAMP: BigInt
                    35.2,               // [9] BEARING: Double
                    25.2,               // [10] SPEED: Double
                ],
            },
        }],
        selectedVehicleId: null,
        selectedVehicle: null,
        selectedVehicleUpdates: [],
    },
    reducers: {
        setSelectedVehicleId(state, action) {
            state.selectedVehicleId = action.payload;
        },

        setSelectedVehicle(state) {
            if (!state.selectedVehicleId) {
                state.selectedVehicle = null;
                return;
            };

            const index = state.vehicles.findIndex(x => Number(x.row.columns[0]) === state.selectedVehicleId);
            state.selectedVehicle = state.vehicles[index];
        },

        clearSelectedVehicle(state) {
            state.selectedVehicleId = null;
            state.selectedVehicle = null;
            state.selectedVehicleUpdates = [];
        },
        clearSelectedVehicleUpdates(state) {
            state.selectedVehicleUpdates = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getVehicles.fulfilled, (state, action) => {
            if (action.payload === null || action.payload.length <= 0) {
                state.vehicles = [];
            };

            state.vehicles = action.payload;
        });
        builder.addCase(getTripUpdates.fulfilled, (state, action) => {
            if (action.payload === null || action.payload.length <= 0) {
                state.selectedVehicleUpdates = [];
            };
            state.selectedVehicleUpdates = action.payload;
        })
    },
};

const vehiclesSlice = createSlice(options);

export default vehiclesSlice.reducer;
export const selectVehicles = state => state.vehicles.vehicles;
export const selectSelectedVehicleId = state => state.vehicles.selectedVehicleId;
export const selectSelectedVehicle = state => state.vehicles.selectedVehicle;
export const selectedVehicleUpdates = state => state.vehicles.selectedVehicleUpdates;
export const { 
    setSelectedVehicleId,
    setSelectedVehicle,
    clearSelectedVehicle,
} = vehiclesSlice.actions;
