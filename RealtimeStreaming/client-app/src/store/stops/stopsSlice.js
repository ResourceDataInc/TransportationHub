import { createSlice } from "@reduxjs/toolkit";
import { getStops } from "./stopsActions";

const options = {
    name: 'stops',
    initialState: {
        stops: [{
            row: {
                columns: ['123', 123, 45.527, -122.693, '123 Address Street'],
            },
        }],
        selectedStopId: null,
        selectedStop: null,
        isLoading: false,
        hasError: false,
    },
    reducers: {
        setSelectedStopId(state, action) {
            state.selectedStopId = action.payload;
        },

        setSelectedStop(state) {
            if (!state.selectedStopId) {
                state.selectedStop = null;
                return;
            };

            const index = state.stops.findIndex(x => x.row.columns[0] === state.selectedStopId);
            state.selectedStop = state.stops[index];
        },

        clearSelectedStop(state) {
            state.selectedStopId = null;
            state.selectedStop = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getStops.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;

            if (action.payload === null || action.payload.length <= 0) {
                state.stops = state.stops;
            } else {
                //console.log(action.payload[0].header.schema);
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
export const selectSelectedStop = (state) => state.stops.selectedStop;
export const { setSelectedStopId, setSelectedStop, clearSelectedStop } = stopsSlice.actions;