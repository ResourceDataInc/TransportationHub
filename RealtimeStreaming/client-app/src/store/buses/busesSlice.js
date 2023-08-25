import { createSlice } from '@reduxjs/toolkit';
import { getVehiclePositions } from './busesActions';

const options = {
    name: 'buses',
    initialState: {
        buses: [{
            key: 4949, 
            value: {
                LATITUDE: 45.517,
                LONGITUDE: -122.683,
            }
        }],
        isLoading: true,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getVehiclePositions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;

            if (action.payload === null || action.payload.length <= 0) {
                state.buses = state.buses;
            } else {
                state.buses = action.payload;
            };

            console.log(`There are ${state.buses.length} buses in the state`);
        });

        builder.addCase(getVehiclePositions.rejected, (state) => {
            state.buses.isLoading = false;
            state.buses.hasError = true;
        });
    },
};

const busesSlice = createSlice(options);

export default busesSlice.reducer;
export const selectBuses = (state) => state.buses.buses;
export const {handleChangePositions} = busesSlice.actions;
