import { createSlice } from '@reduxjs/toolkit';
import { getVehicles } from './vehiclesActions';

const options = {
    name: 'vehicles',
    initialState: {
        vehicles: [{
            row: {
                columns: [4949, 45.517, -122.683],
            },
        }],
        selectedVehicleId: null,
        selectedVehicle: null,
        isLoading: true,
        hasError: false,
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
            state.isLoading = false;
            state.hasError = false;

            if (action.payload === null || action.payload.length <= 0) {
                state.vehicles = state.vehicles;
            } else {
                //console.log(action.payload[0].header.schema);
                action.payload.shift();
                state.vehicles = action.payload;
            };

            console.log(`There are ${state.vehicles.length} buses in the state`);
        });

        builder.addCase(getVehicles.rejected, (state) => {
            state.buses.isLoading = false;
            state.buses.hasError = true;
        });
    },
};

const vehiclesSlice = createSlice(options);

export default vehiclesSlice.reducer;
export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectSelectedVehicle = (state) => state.vehicles.selectedVehicle;
export const { setSelectedVehicleId, setSelectedVehicle, clearSelectedVehicle } = vehiclesSlice.actions;
