import { createSlice } from "@reduxjs/toolkit";
import { getStops } from "./stopsActions";

const options = {
    name: 'stops',
    initialState: {
        stops: [{
            row: {
                columns: [
                    '123',                      // [0] STOP_ID: String
                    123,                        // [1] TRIP_SEQ_ID: String
                    45.527,                     // [2] STOP_LAT: Double
                    -122.693,                   // [3] STOP_LON: Double
                    '123 Address Street',       // [4] STOP_NAME: String
                    '3950',                     // [5] VEHICLE_ID: String
                    {                           // [6] STOP_TIME_UPDATE: 
                        'STOP_ID': '123',
                        'STOP_SEQUENCE': 59,
                        'SCHEDULE_RELATIONSHIP': '',
                        'ARRIVAL': {
                            'DELAY': 100,
                            'TIME': 0,
                            'UNCERTAINTY': 0,
                        }, 
                        'DEPARTURE': {
                            'DELAY': 100,
                            'TIME': 0,
                            'UNCERTAINTY': 0,
                        },
                    },
                    1694709653                  // [7] TIMESTMP: BigInt
                ],
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