import { createSlice } from "@reduxjs/toolkit";
import { getStops } from "./stopsActions";

const options = {
    name: 'stops',
    initialState: {
        stops: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStops.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;

            if (action.payload === null || action.payload.length <= 0) {
                state.stops = state.stops;
            } else {
                //console.log(action.payload[0].header.schema)
                action.payload.shift();
                state.stops = action.payload;
            };

            console.log(`There are ${state.stops.length} stops in the state`);
        });

        builder.addCase(getStops.rejected, (state) => {
            state.isLoading = false;
            state.hasError = true;
        });
    },
};

const stopsSlice = createSlice(options);

export default stopsSlice.reducer;
export const selectStops = (state) => state.stops.stops;
