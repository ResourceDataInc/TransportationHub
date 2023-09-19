import { createSlice } from '@reduxjs/toolkit';
import { getVehicles } from './vehiclesActions';

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
                    1694712350          // [7] TIMESTMP: BigInt
                ],
            },
        }],
        selectedVehicleId: null,
        selectedVehicle: null,
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
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getVehicles.fulfilled, (state, action) => {
            if (action.payload === null || action.payload.length <= 0) {
                return;
            } else {
                state.vehicles = action.payload;
            };

            console.log(`There are ${state.vehicles.length} buses in the state`);
        });
    },
};

const vehiclesSlice = createSlice(options);

export default vehiclesSlice.reducer;
export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectSelectedVehicle = (state) => state.vehicles.selectedVehicle;
export const { setSelectedVehicleId, setSelectedVehicle, clearSelectedVehicle } = vehiclesSlice.actions;
