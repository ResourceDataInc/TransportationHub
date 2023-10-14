import { createSlice } from "@reduxjs/toolkit";
import { getAllStopEvents, getAllStops, getStopsWithinMapBounds } from "./stopsActions";

const options = {
    name: 'stops',
    initialState: {
        stopEvents: [{
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
                    1694709653,                 // [7] TS: BigInt
                    '123',                      // [8] ROUTE_ID: String
                    0,                          // [9] DIRECTION_ID: BigInt
                ],
            },
        }],
        stops: [{
            row: {
                columns: [
                    0,                     // [0] INDEX: String
                    1,                     // [1] DIRECTION_ID: Int
                    '15',                  // [2] ROUTE_ID: String
                    '13238',               // [3] STOP_ID: String
                    45.546127,             // [4] STOP_LAT: Double
                    -122.719019,           // [5] STOP_LON: Double
                    '3300 Block NW 35th',  // [6] STOP_NAME: String
                    6,                     // [7] STOP_SEQUENCE: Int
                ],
            },
        }],
        selectedStopId: null,
        selectedStop: null,
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
        builder.addCase(getAllStops.fulfilled, (state, action) => {
            if (action.payload === null || action.payload.length <= 0) {
                return;
            } else {
                state.stops = action.payload;
            };
        });

        builder.addCase(getStopsWithinMapBounds.fulfilled, (state, action) => {
            if (action.payload === null || action.payload.length <= 0) {
                return;
            } else {
                state.stops = action.payload;
            }; 

            console.log(`There are ${state.stops.length} stops in the state`);
        });
    },
};

const stopsSlice = createSlice(options);

export default stopsSlice.reducer;
export const selectStops = (state) => state.stops.stops;
export const selectSelectedStopId = (state) => state.stops.selectedStopId;
export const selectSelectedStop = (state) => state.stops.selectedStop;
export const { setSelectedStopId, setSelectedStop, clearSelectedStop } = stopsSlice.actions;
