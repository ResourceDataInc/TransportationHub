import { createSlice } from '@reduxjs/toolkit';

const options = {
    name: 'display',
    initialState: {
        vehicleCard: null,
        stopCard: null,
    },
    reducers: {
        setVehicleCard(state, action) {
            state.vehicleCard = action.payload;
        },
        setStopCard(state, action) {
            state.stopCard = action.payload;
        },
    },
};

const displaySlice = createSlice(options);

export default displaySlice.reducer;
export const selectVehicleCard = (state) => state.display.vehicleCard;
export const selectStopCard = (state) => state.display.stopCard;
export const { setVehicleCard, setStopCard } = displaySlice.actions;
